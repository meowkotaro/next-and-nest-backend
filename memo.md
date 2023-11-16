## srcフォルダについて

- main.tsがエントリーポイントになっている
- 各機能をmoduleという単位で管理していく
  例えば認証関係はauth.module、タスク関係はtodo.moduleといった形にして開発していく
- 使用したいmoduleをroute moduleであるapp.moduleにインポートすることによってmoduleの機能を使用することができる
- 各moduleには`Controller` `Servise` の機能がある
- Controllerはルーティング処理
- Serviseはビジネスロジック
- ServiseをControllerにDIする
  (DI -> Dependency Injection) -> ソフトウェアを疎結合にするためのデザインパターン
