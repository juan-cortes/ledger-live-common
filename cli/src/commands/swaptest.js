// @flow
/* eslint-disable no-console */
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import Swap from "@ledgerhq/hw-app-swap";
import { deviceOpt } from "../scan";
import { from } from "rxjs";
import { tap, first, map, reduce } from "rxjs/operators";
import axios from "axios";
import Btc from "@ledgerhq/hw-app-btc";
import secp256k1 from "secp256k1";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { setSupportedCurrencies } from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import { accountToReceiveSwap, accountToSendSwap } from "../poc/accounts";

const swapTemplate = {
  provider: "Changelly",
  ip: "31.4.241.115",
  amountFrom: 0.04,
  from: "BTC",
  to: "LTC",
  rateId: undefined,
  address: accountToReceiveSwap.freshAddress,
  refundAddress: accountToSendSwap.freshAddress,
  deviceTransactionId: undefined
};

const swapAPI = "https://swap.dev.aws.ledger.fr";
const test = async (transport, action) => {
  if (action === "sign") {
    const bridge = getAccountBridge(accountToSendSwap);
    console.log("Sync the account");
    const account = await bridge
      .sync(accountToSendSwap, { paginationConfig: {} })
      .pipe(reduce((a, f) => f(a), accountToSendSwap))
      .toPromise();

    const transaction = {
      family: "bitcoin",
      amount: 4000000,
      recipient: "3FT6xMgEWS2XHNMNsHv6sX4ujZo1K4dXiF",
      feePerByte: "19",
      networkInfo: {
        family: "bitcoin",
        feeItems: {
          items: [
            {
              key: "0",
              speed: "high",
              feePerByte: "21"
            },
            {
              key: "1",
              speed: "standard",
              feePerByte: "19"
            },
            {
              key: "2",
              speed: "low",
              feePerByte: "19"
            }
          ],
          defaultFeePerByte: "19"
        }
      },
      useAllAmount: false
    };
    console.log("Attempt to sign transaction");
    const signedTransaction = await bridge
      .signOperation({
        account,
        transaction
      })
      .pipe(
        tap(e => console.log(e)), // log events
        first(e => e.type === "signed"),
        map(e => e.signedOperation)
      )
      .toPromise();
    console.log({ signedTransaction });
  } else if (action === "generate") {
    const swap: Swap = new Swap(transport);
    console.log("------------------------------------");
    console.log("      STARTING NEW SWAP TEST ");
    console.log("------------------------------------");

    console.log("⁍ Get swap version");
    console.log(await swap.getVersion());

    console.log("⁍ Requesting a new swap transaction from swap app");
    const swapTxId = await swap.startNewTransaction();
    swapTemplate.deviceTransactionId = swapTxId;

    console.log("    Swap id:\t", swapTxId);
    console.log("⁍ Requesting a fixed rate from backend");
    const res = await axios.post(`${swapAPI}/rate/fixed`, [
      {
        from: swapTemplate.from,
        to: swapTemplate.to,
        amountFrom: swapTemplate.amountFrom
      }
    ]);
    const fixedRate = res.data[0].FixedRate;
    if (!fixedRate) {
      console.log("⁍ Amount likely out of range or other error");
      console.log(res.data);
      return;
    }

    swapTemplate.rateId = fixedRate.rateId;
    console.log("    Rate id:\t", fixedRate.rateId);
    console.log("    Rate:\t", {
      amountFrom: fixedRate.amountFrom,
      amountTo: fixedRate.amountTo
    });

    console.log("⁍ Setting partner on swap");
    await swap.setPartnerKey(partnerSerializedNameAndPubKey);
    console.log("⁍ Checking partner on swap");
    await swap.checkPartner(DERSignatureOfPartnerNameAndPublicKey);

    console.log("⁍ Sending the swap data to backend");
    console.log(swapTemplate);
    const res2 = await axios.post(`${swapAPI}/swap`, [swapTemplate]);
    const swapResult = res2.data[0];
    console.log(swapResult);
    console.log(
      "    Binary payload:\t",
      swapResult.binaryPayload.replace(/(.{300})..+/, "$1…")
    );
    console.log("    Signature:\t\t", swapResult.signature);
    console.log("    Valid til:\t\t", swapResult.payTill);
    console.log("    Fee:\t\t", swapResult.apiFee);
    console.log("    Extra fee:\t\t", swapResult.apiExtraFee);
    console.log("    We pay to:\t\t", swapResult.payinAddress);
    console.log("    We receive at:\t", swapResult.payoutAddress);

    console.log("⁍ Pass payload to swap");
    await swap.processTransaction(Buffer.from(swapResult.binaryPayload, "hex"));

    console.log("⁍ Check transaction signature");
    const goodSign = secp256k1.signatureExport(
      Buffer.from(swapResult.signature, "hex")
    );
    await swap.checkTransactionSignature(goodSign);

    const btc = new Btc(transport);
    const ltcAddressParams = await btc.getSerializedAddressParameters(
      accountToReceiveSwap.freshAddressPath,
      "legacy"
    );
    console.log({ ltcAddressParams });
    await swap.checkPayoutAddress(
      LTCConfig,
      LTCConfigSignature,
      ltcAddressParams.addressParameters
    );

    const btcAddressParams = await btc.getSerializedAddressParameters(
      accountToSendSwap.freshAddressPath,
      "bech32"
    );
    await swap.checkRefundAddress(
      BTCConfig,
      BTCConfigSignature,
      btcAddressParams.addressParameters
    );
    setSupportedCurrencies(["bitcoin"]);

    const accountBridge = getAccountBridge(accountToSendSwap);

    let tx = accountBridge.createTransaction(accountToSendSwap);
    tx = accountBridge.updateTransaction(tx, {
      amount: swapResult.amountExpectedFrom,
      recipient: swapResult.payinAddress
    });
    tx = await accountBridge.prepareTransaction(accountToSendSwap, tx);
    // FIXME we send decimals but swap wants satoshis
    tx.amount = tx.amount * 10 ** 8;

    console.log({ tx });
    // TODO we can't sign with swap app, so log this tx to sign above
    // by calling this command with -a sign
  } else {
    console.log("What are you doing?");
  }
};

export default {
  args: [deviceOpt, { name: "action", alias: "a", type: String }],
  job: ({
    device,
    action = "generate"
  }: $Shape<{ device: string, action: string }>) =>
    withDevice(device || "")(transport => from(test(transport, action)))
};

// Hardcoded stuff that needs to be provided
const BTCConfig: Buffer = Buffer.from([0x3, 0x62, 0x74, 0x63, 0x7, 0x42, 0x69, 0x74, 0x63, 0x6F, 0x69, 0x6E, 0x0]); // prettier-ignore
const BTCConfigSignature: Buffer = Buffer.from([0x30, 0x44, 0x2, 0x20, 0x47, 0x75, 0xEF, 0x48, 0x8D, 0x5D, 0x14, 0xCB, 0x26, 0x7F, 0x94, 0xDE, 0x61, 0x4D, 0x5F, 0x80, 0xB5, 0x78, 0x3A, 0x12, 0xE0, 0x30, 0x33, 0xE7, 0xA5, 0xEA, 0xC, 0x48, 0xCC, 0x28, 0xFE, 0x37, 0x2, 0x20, 0x76, 0xDE, 0xDE, 0xE9, 0x88, 0xFE, 0xA9, 0xBD, 0x7B, 0x7F, 0x76, 0x8E, 0x53, 0x19, 0xA4, 0x5A, 0x43, 0x2, 0xF1, 0x6C, 0x10, 0xD1, 0xE9, 0x45, 0x98, 0xE4, 0xB2, 0x7B, 0x16, 0x49, 0x88, 0x97]); // prettier-ignore
const LTCConfig: Buffer = Buffer.from([0x3, 0x6C, 0x74, 0x63, 0x8, 0x4C, 0x69, 0x74, 0x65, 0x63, 0x6F, 0x69, 0x6E, 0x0]); // prettier-ignore
const LTCConfigSignature: Buffer = Buffer.from([0x30, 0x45, 0x2, 0x21, 0x0, 0x8A, 0xBA, 0x2F, 0x2C, 0xAF, 0x35, 0xEB, 0xDA, 0x85, 0x7C, 0x43, 0x5A, 0x7E, 0x1F, 0x84, 0xE3, 0x85, 0x23, 0x4D, 0x25, 0xE7, 0x13, 0x10, 0x9, 0xDA, 0x69, 0xF2, 0x4B, 0xDF, 0x99, 0x10, 0x3D, 0x2, 0x20, 0x47, 0xB6, 0x2F, 0xC5, 0x89, 0x45, 0x3, 0xC9, 0x59, 0x8, 0x20, 0xEB, 0xC3, 0x36, 0x35, 0x7A, 0x85, 0xDE, 0xF0, 0x34, 0xB7, 0xCC, 0x4C, 0x25, 0xD3, 0xE, 0x75, 0x6C, 0x8E, 0x5D, 0xC5, 0x84]); // prettier-ignore

const partnerSerializedNameAndPubKey: Buffer = Buffer.from([0x9, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x6C, 0x6C, 0x79, 0x4, 0x80, 0xD7, 0xC0, 0xD3, 0xA9, 0x18, 0x35, 0x97, 0x39, 0x5F, 0x58, 0xDD, 0xA0, 0x59, 0x99, 0x32, 0x8D, 0xA6, 0xF1, 0x8F, 0xAB, 0xD5, 0xCD, 0xA0, 0xAF, 0xF8, 0xE8, 0xE3, 0xFC, 0x63, 0x34, 0x36, 0xA2, 0xDB, 0xF4, 0x8E, 0xCB, 0x23, 0xD4, 0xD, 0xF7, 0xC3, 0xC7, 0xD3, 0xE7, 0x74, 0xB7, 0x7B, 0x4B, 0x5D, 0xF0, 0xE9, 0xF7, 0xE0, 0x8C, 0xF1, 0xCD, 0xF2, 0xDB, 0xA7, 0x88, 0xEB, 0x8, 0x5B]); // prettier-ignore
const DERSignatureOfPartnerNameAndPublicKey: Buffer = Buffer.from([0x30, 0x44, 0x2, 0x20, 0x6A, 0x57, 0xC9, 0xED, 0x40, 0x30, 0xCB, 0x21, 0x70, 0xA3, 0x45, 0x74, 0x73, 0x75, 0x7E, 0x6, 0x3F, 0xE7, 0x27, 0xC1, 0x43, 0x0, 0x2, 0x51, 0xD9, 0xE9, 0x7F, 0x27, 0x89, 0x90, 0x29, 0x80, 0x2, 0x20, 0x7B, 0x11, 0x97, 0xDA, 0x75, 0xFE, 0x90, 0x9C, 0xB9, 0xE2, 0x85, 0x77, 0x5A, 0xF9, 0xC9, 0x6A, 0x62, 0x69, 0x5C, 0x18, 0x74, 0x56, 0x5B, 0xC6, 0x7B, 0x18, 0xF9, 0xF7, 0xC6, 0x11, 0xDE, 0x82]); // prettier-ignore
