from pathlib import Path
import subprocess,os
import argparse, tempfile, shutil
parser = argparse.ArgumentParser(description="Test only the resolver ancestor error predicate; not Android syscalls")
parser.add_argument("checkout", type=Path, help="Patched Bun source checkout")
parser.add_argument("--base", default="c6da4a4d3010e5553438c60f6bd76d981976867c")
options = parser.parse_args()
checkout = options.checkout.resolve()
source = checkout / "src/resolver/resolver.rs"
rust = shutil.which("rustc")
if rust is None:
    raise SystemExit("rustc must be on PATH (use the pinned Bun toolchain)")
scratch = tempfile.TemporaryDirectory(prefix="bun-ancestor-policy-")
root = Path(scratch.name)
root.joinpath("toolchains").mkdir()
env = os.environ.copy()
host_info = subprocess.check_output([rust, "-vV"], env=env, text=True)
if not any("host: " in line and "-unknown-linux-" in line for line in host_info.splitlines()):
    raise SystemExit("Run this predicate check on a Linux host; use check-shared-storage.sh on Android")
def program(text):
 start=text.index('if queue_slice_len > 0')
 end=text.index('\n                            {',start)
 expression=text[start+3:end]
 return '''#![allow(non_camel_case_types)]
mod bun_errno {
 #[derive(Clone, Copy, Debug, PartialEq, Eq)]
 pub enum SystemErrno { ENOENT, EACCES, EPERM, EIO }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Error { Sys(bun_errno::SystemErrno) }
fn policy(queue_slice_len: usize, err: Error) -> bool {
'''+expression+'''
}
#[test] fn android_hidden_parent() {
 assert_eq!(policy(1, Error::Sys(bun_errno::SystemErrno::ENOENT)), cfg!(target_os="android"));
}
#[test] fn missing_target() { assert!(!policy(0, Error::Sys(bun_errno::SystemErrno::ENOENT))); }
#[test] fn permission_parent() {
 assert!(policy(1, Error::Sys(bun_errno::SystemErrno::EACCES)));
 assert!(policy(1, Error::Sys(bun_errno::SystemErrno::EPERM)));
}
#[test] fn permission_target() {
 assert!(!policy(0, Error::Sys(bun_errno::SystemErrno::EACCES)));
 assert!(!policy(0, Error::Sys(bun_errno::SystemErrno::EPERM)));
}
#[test] fn other_errors() { assert!(!policy(1, Error::Sys(bun_errno::SystemErrno::EIO))); }
'''
src=root/'toolchains/ancestor-policy.rs';src.write_text(program(source.read_text()))
for platform in ['linux','android']:
 out=root/'toolchains'/('ancestor-policy-'+platform)
 args=[str(rust),'--test',str(src),'-o',str(out)]
 if platform=='android':args+=['--cfg','target_os="android"','-Aexplicit_builtin_cfgs_in_flags']
 subprocess.run(args,env=env,check=True)
 subprocess.run([str(out)],env=env,check=True)
original=subprocess.check_output(['git','show',options.base+':src/resolver/resolver.rs'],cwd=checkout).decode()
src.write_text(program(original));out=root/'toolchains/ancestor-policy-before'
subprocess.run([str(rust),'--test',str(src),'-o',str(out),'--cfg','target_os="android"','-Aexplicit_builtin_cfgs_in_flags'],env=env,check=True)
r=subprocess.run([str(out)],env=env)
assert r.returncode!=0,'Baseline unexpectedly passes'
print('Baseline fails Android parent ENOENT; patched condition passes both configurations.')
src.write_text(program(source.read_text()))
