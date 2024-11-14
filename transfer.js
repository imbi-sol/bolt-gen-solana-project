const { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');

async function transferSOL() {
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Generate a new wallet (sender)
  const fromWallet = Keypair.generate();

  // Specific recipient address
  const toWalletAddress = new PublicKey('GcSoPa7phzocVtZYy7NrWJVxnnbo6p8KTrztghKusNQr');

  // Request airdrop for testing (only works on devnet)
  console.log('Requesting airdrop...');
  const airdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);

  // Create transfer instruction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWalletAddress,
      lamports: LAMPORTS_PER_SOL * 0.5 // Transfer 0.5 SOL
    })
  );

  // Send and confirm transaction
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet]
    );
    console.log('Source:', fromWallet.publicKey.toString());
    console.log('Destination:', toWalletAddress.toString());
    console.log('Success! Transaction signature:', signature);
  } catch (error) {
    console.error('Error:', error);
  }
}

transferSOL();
