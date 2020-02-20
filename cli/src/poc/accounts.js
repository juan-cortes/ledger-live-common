// @flow
import { findCryptoCurrencyById } from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import { fromAccountRaw } from "@ledgerhq/live-common/lib/account";

export const accountToSendSwap = fromAccountRaw({
  id:
    "libcore:1:bitcoin:xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs:native_segwit",
  seedIdentifier:
    "0432bdb627888a585281a23ba94bc2e556874b0d6f02be854b80486a2e87e9e30200d24f9587530853d2c9a70851793ed031ea2b09ffdaf23e8b2643ca3d5f127c",
  name: "Bitcoin 1 (native segwit)",
  starred: false,
  derivationMode: "native_segwit",
  index: 0,
  freshAddress: "bc1qnnv9ekuj5jk3c4fs5n0dsjd4l9qs6aslmh844q",
  freshAddressPath: "84'/0'/0'/0/1",
  freshAddresses: [
    {
      address: "bc1qnnv9ekuj5jk3c4fs5n0dsjd4l9qs6aslmh844q",
      derivationPath: "84'/0'/0'/0/1"
    },
    {
      address: "bc1qnzn79xkejceam32f0y22xjtzlzwj2znze7ppyk",
      derivationPath: "84'/0'/0'/0/2"
    },
    {
      address: "bc1qxg6gj2ugm2k8k9nkgpshsgllq72ut2ehprpnrj",
      derivationPath: "84'/0'/0'/0/3"
    },
    {
      address: "bc1qlh7rt6jfnf697ftd57a48486sakn62gmzfvylt",
      derivationPath: "84'/0'/0'/0/4"
    },
    {
      address: "bc1qw3msypsc4e8e3mjxfv7vaaqr5uzdwp7pfqq9z2",
      derivationPath: "84'/0'/0'/0/5"
    },
    {
      address: "bc1q7030py9r82lvtmg6g5pes2g73sjq5jrdpfmke6",
      derivationPath: "84'/0'/0'/0/6"
    },
    {
      address: "bc1qdpkjcm8n5kml8djhsdsqchvch3p4nnh0dn7j93",
      derivationPath: "84'/0'/0'/0/7"
    },
    {
      address: "bc1q33u2svfc9hntxzzhtltkkja28cgym0700pf489",
      derivationPath: "84'/0'/0'/0/8"
    },
    {
      address: "bc1q8hk8qjw3zls3puq4q4kt6tcxszshzkqp8vk5xu",
      derivationPath: "84'/0'/0'/0/9"
    },
    {
      address: "bc1qt6j34rv9aj5rc7rxamxtvlp0xqf0qmg8ay58dx",
      derivationPath: "84'/0'/0'/0/10"
    },
    {
      address: "bc1qxywwcles8jn7qhpw4ujauwluy8gnczkgxn0n03",
      derivationPath: "84'/0'/0'/0/11"
    },
    {
      address: "bc1quhv7lljfnevsr3lyy8474dm3vhqzj7lq6v9vs7",
      derivationPath: "84'/0'/0'/0/12"
    },
    {
      address: "bc1qksx2ts8flhxtzr8n9pjyk22976j8364zvzturp",
      derivationPath: "84'/0'/0'/0/13"
    },
    {
      address: "bc1q2wph4ggr5zyurfegzaythtks4wd86k2g8065re",
      derivationPath: "84'/0'/0'/0/14"
    },
    {
      address: "bc1qteval839ldxz5d0d5vcxeyya0y24hwn0tzr08g",
      derivationPath: "84'/0'/0'/0/15"
    },
    {
      address: "bc1qh429hk95ks4l0tvcahnjxytamjuuxmvysy3dgw",
      derivationPath: "84'/0'/0'/0/16"
    },
    {
      address: "bc1qcmm6djqkmtl4thkeuy4kqxftjcf44kvxztv6wq",
      derivationPath: "84'/0'/0'/0/17"
    },
    {
      address: "bc1qsx9c9ue6c6cln3rvjem0y7ktyhxzlg0y98nthz",
      derivationPath: "84'/0'/0'/0/18"
    },
    {
      address: "bc1qahd9d8ympd2jxhx50r26t8prt4x0xzcj66dcud",
      derivationPath: "84'/0'/0'/0/19"
    },
    {
      address: "bc1quk4yjm8gf2txzdgmp2t9rnga5jrnemgn8htfgu",
      derivationPath: "84'/0'/0'/0/20"
    }
  ],
  blockHeight: 618200,
  operationsCount: 2,
  operations: [
    {
      id:
        "libcore:1:bitcoin:xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs:native_segwit-2e824599a0fce87f436c13ded589cb225823a04a8ff192b25d51e859763e2052-IN",
      type: "IN",
      senders: ["34v2Tib9ras4UyzH5LyFk4CXsTMaSj8uCH"],
      recipients: [
        "bc1q50myyysx7pzgcyfmnwu4efy2wr8wywmggfms2d",
        "3Jb3vF9NB8zrfqSPDtB11hfmYGpQkwsXZG"
      ],
      blockHeight: 617391,
      blockHash: null,
      accountId:
        "libcore:1:bitcoin:xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs:native_segwit",
      extra: {},
      hash: "2e824599a0fce87f436c13ded589cb225823a04a8ff192b25d51e859763e2052",
      date: "2020-02-14T17:34:56.000Z",
      value: "1000000",
      fee: "4704"
    },
    {
      id:
        "libcore:1:bitcoin:xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs:native_segwit-b23ddfd0ce49c2771e085c8aa7b6996e43a0a99f60aec841a5903bdf29885a2d-IN",
      type: "IN",
      senders: ["37JvQubScqbApfvNcACjexMVp9KG6VmGZ6"],
      recipients: [
        "bc1q50myyysx7pzgcyfmnwu4efy2wr8wywmggfms2d",
        "3FmWUnAF3UQqE41DJneT1jBkT5kK1ymrFE"
      ],
      blockHeight: 617239,
      blockHash: null,
      accountId:
        "libcore:1:bitcoin:xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs:native_segwit",
      extra: {},
      hash: "b23ddfd0ce49c2771e085c8aa7b6996e43a0a99f60aec841a5903bdf29885a2d",
      date: "2020-02-13T18:25:37.000Z",
      value: "40000",
      fee: "5376"
    }
  ],
  pendingOperations: [],
  currencyId: "bitcoin",
  unitMagnitude: 8,
  lastSyncDate: "2020-02-20T11:12:00.087Z",
  balance: "1040000",
  balanceHistory: {},
  spendableBalance: "1040000",
  xpub:
    "xpub6D4xrRjfZp6bgGTfDHHjCFsS8E9LbXB3u4izJAwVxNSUoFugt4qd83zLywBrRooPzfWrcKLC1D7DipjECEEsRMCqhM2ptb5yKVmLgUnVGUs"
});

export const accountToReceiveSwap = {
  freshAddress: "LY65KK642pX7MtjgUdzegYgKsUskeCRe55", //"MQ7mSEeL8zcghLxVhKcgkH4BYmQ1vNgSH1",
  freshAddressPath: " 49'/2'/0'/0/0",
  currencyId: "litecoin",
  xpub:
    "Ltub2YQy7ASMeb7PYatDvv1PfvukhDemVRDwXUN55z5rfMTaDztZFrn9iScxB8ZmGzpJSaNxKhva2FXVYaUjpZHQfpxJXqvAfJ4V6VLBtweH5ys"
};
