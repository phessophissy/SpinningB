
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.4.2/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';


Clarinet.test({
    name: "Ensure that player can play",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('spinning-board', 'play', [types.uint(5)], wallet1.address)
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[0].events.expectSTXTransferEvent(1000, wallet1.address, `${accounts.get('deployer')!.address}.spinning-board`);
    },
});

Clarinet.test({
    name: "Ensure that player cannot provide invalid spin",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('spinning-board', 'play', [types.uint(0)], wallet1.address),
            Tx.contractCall('spinning-board', 'play', [types.uint(11)], wallet1.address)
        ]);

        block.receipts[0].result.expectErr(types.uint(101)); // ERR_INVALID_SPIN
        block.receipts[1].result.expectErr(types.uint(101)); // ERR_INVALID_SPIN
    },
});

Clarinet.test({
    name: "Ensure that player cannot play twice in the same round",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('spinning-board', 'play', [types.uint(5)], wallet1.address),
            Tx.contractCall('spinning-board', 'play', [types.uint(6)], wallet1.address)
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr(types.uint(103)); // ERR_ALREADY_PLAYED
    },
});


