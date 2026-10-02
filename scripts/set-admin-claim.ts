/**
 * Script administrativo seguro de uso único para aplicar Custom Claim { admin: true }
 * em uma conta de administrador existente via Firebase Admin SDK.
 * 
 * Uso:
 *   npx tsx scripts/set-admin-claim.ts <user-email-ou-uid>
 */
import dotenv from 'dotenv';
import { adminAuth, firestore } from '../api/_firebaseAdmin.js';

dotenv.config();

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Uso: npx tsx scripts/set-admin-claim.ts <user-email-ou-uid>');
    process.exit(1);
  }

  if (!adminAuth) {
    console.error('Erro: Firebase Admin Auth não está inicializado. Configure FIREBASE_SERVICE_ACCOUNT_BASE64 no .env.');
    process.exit(1);
  }

  console.log(`Buscando usuário: ${target}...`);
  let uid = target;

  if (target.includes('@')) {
    try {
      const userRecord = await adminAuth.getUserByEmail(target.trim().toLowerCase());
      uid = userRecord.uid;
      console.log(`Usuário encontrado: UID=${uid}, Email=${userRecord.email}`);
    } catch (e: any) {
      console.error(`Erro ao buscar usuário por email:`, e.message);
      process.exit(1);
    }
  }

  // 1. Set Custom Claim on Firebase Auth
  await adminAuth.setCustomUserClaims(uid, { admin: true });
  console.log(`Custom claim { admin: true } aplicada com sucesso para o UID: ${uid}`);

  // 2. Update Firestore role if firestore is connected
  if (firestore) {
    try {
      await firestore.collection('users').doc(uid).set({
        role: 'admin',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log(`Documento Firestore users/${uid} atualizado com role='admin'.`);
    } catch (e: any) {
      console.warn(`Aviso ao atualizar Firestore:`, e.message);
    }
  }

  console.log(`\nConcluído com sucesso! Instrua o usuário a efetuar logout e login novamente para atualizar o ID Token com a nova claim.`);
}

main().catch((err) => {
  console.error('Falha na execução do script:', err);
  process.exit(1);
});
