NECモバイルバックエンド基盤 CLI
===============================

概要
----

NEC モバイルバックエンド基盤のコマンドラインインタフェース(CLI)ツールです。
主に API Gateway / Cloud Functions 関連の管理機能を提供します。

本ツールはサーバ管理用の CLI (baas-admin) とは異なり、クライアントサイドで使用する
ツールになります。サーバとは REST API で通信します。

本ツールの詳細は、NEC モバイルバックエンド基盤マニュアル内の
「API Gateway利用手順書」および「Cloud Functions開発ガイド」を参照してください。

インストール手順
----------------

動作には Node.js v6.0.0 以上が必要です。
インストールは以下のように npm を使って行います。

    $ npm install -g @nec-baas/cli

設定
----

ユーザコードのプロジェクトディレクトリで、
 
    $ nebula init-config

を実行してください。nebula_config.json が生成されるので、
設定を追記してください。

使用方法
--------

使用方法は "nebula -h" で確認してください。
いくつか手順を示します。

### コードの登録

コード登録は以下のように行います。

    $ npm pack
    $ nebula create-code

アップロードするファイル名を --file オプションで指定します。

--file オプションは省略可能です。
省略した場合、コード登録に必要な情報は package.json から取得します。
具体的には以下の情報が参照されます。

* name: ハンドラの名称
* version: ハンドラのバージョン

アップロードに使用するファイル名は "{name}-{version}.tgz"となります。

### API定義の登録

API を定義した Swagger 定義ファイルを JSON または YAML で作成してください。
(YAML の場合は、拡張子を .yaml または .yml にしてください)

以下手順で API 定義を登録します。

    $ nebula create-api [Swagger定義ファイル]

Swagger 定義ファイル作成時の注意点は以下のとおりです。

* basePath 記載されたパス(の最終パス部分)が API 名として使用されますので、必ず記述してください。
* 各 API には、必ず operationId を記載してください。

### ファンクションの登録

バインディング定義ファイルを JSON または YAML で作成してください。
(YAML の場合は、拡張子を .yaml または .yml にしてください)

以下手順でファンクションを登録します。

    $ nebula create-function [Function定義ファイル] 

サンプル
--------

サンプルのコード、API定義、ファンクション定義は、examples/hello ディレクトリに
あります。
