import PocketBase from 'pocketbase';

const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://127.0.0.1:8090';
const adminEmail = args[1] || 'admin@local.host';
const adminPass = args[2] || 'password123';

const pb = new PocketBase(baseUrl);

async function main() {
  console.log(`Connecting to ${baseUrl}...`);

  // 1. Authenticate as Admin
  try {
    await pb.admins.authWithPassword(adminEmail, adminPass);
    console.log('✅ Authenticated as Admin');
  } catch (e) {
    console.error('❌ Authentication failed:', e.message);
    if (e.status === 404) {
      console.error('Note: If this is Pockethost, double check your URL (e.g., https://your-server.pockethost.io) and ensure the server is awake.');
    }
    process.exit(1);
  }

  // 2. Create Invoices Collection
  try {
    const existing = await pb.collections.getOne('invoices').catch(() => null);
    if (existing) {
      console.log('ℹ️ Invoices collection already exists.');
    } else {
      const invoicesSchema = {
          name: 'invoices',
          type: 'base',
          schema: [
            { name: 'file', type: 'file', required: true, options: { maxSelect: 1, maxSize: 5242880 } },
            { name: 'date', type: 'date', required: true, options: {} },
            { name: 'description', type: 'text', required: false, options: {} },
            { name: 'amount', type: 'number', required: false, options: {} },
            { name: 'uploaded_by', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', maxSelect: 1 } }
          ],
          listRule: '@request.auth.id != ""',
          viewRule: '@request.auth.id != ""',
          createRule: '@request.auth.id != ""',
          updateRule: '@request.auth.id = uploaded_by.id',
          deleteRule: '@request.auth.id = uploaded_by.id'
      };
      
      await pb.collections.create(invoicesSchema);
      console.log('✅ Invoices collection created');
    }
  } catch (e) {
    console.error('❌ Failed to create collection:', e.originalError || e);
  }
  
  // 3. Create Users
  await createUser('bruno.neonretreat@gmail.com', '1234567890', 'Bruno Pereira'); // Assuming user wants a known password for testing
  await createUser('accountant@local.host', '1234567890', 'Accountant');
}

async function createUser(email, password, name) {
    try {
        await pb.collection('users').create({
            email, 
            password, 
            passwordConfirm: password, 
            name, 
            emailVisibility: true, 
            verified: true
        });
        console.log(`✅ User ${email} created`);
    } catch (e) {
        // Ignore validation errors (e.g., email already exists)
        if (e.status !== 400) {
           console.log(`⚠️ User ${email} creation issue:`, e.message);
        } else {
           console.log(`ℹ️ User ${email} already likely exists.`);
        }
    }
}

main();
