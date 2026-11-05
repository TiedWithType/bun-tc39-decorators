# Bun 1.4.3 — Windows x64

Kompilacja release/baseline ze wszystkimi czterema patchami zakończona (EXIT 0).
Patch HMR jest wspólny dla platform; trzy poprawki Termuksa pozostają warunkowe.

- Źródła: `daf9b8beba027bc8d04be41f86766ca4f8c91d31`, tree `73f0265abd4f8402ed88a653a1a4d374dab470b6`.
- PE32+, AMD64, aplikacja konsolowa; bez wymogu AVX.
- Kontrole: 736 eksportów, 15 bibliotek DLL, 429 importów, 5 właściwości hardening, 0 zduplikowanych silnych symboli. Weryfikacja ścisła: EXIT 0.
- HMR codegen: wszystkie 10 helperów w module klienta i serwera. To kontrola statyczna, nie interaktywny test HMR.
- Binarka w paczce jest identyczna z kontrolowanym `bun-profile.exe`.
- Pierwszy link przekroczył limit pamięci. Udana próba użyła jednego zadania LTO i `/threads:1`.
- Ostrzeżenia LNK4099 dotyczą brakujących plików PDB bibliotek MSVC, nie brakujących bibliotek wykonawczych.
- Uruchomienie w natywnym Windows pozostaje do sprawdzenia. Wine w środowisku budowania nie może tworzyć socketu serwera.

SHA256 `bun.exe`: `1a493488e3e7ef039233f187c0cedcb2c37f07eeb785c1a28c668971e7ad227f`.
