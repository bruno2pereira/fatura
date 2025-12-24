const baseUrl = 'http://127.0.0.1:8090';

async function main() {
  // 1. Create Admin
  try {
      const res = await fetch(`${baseUrl}/api/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@local.host', password: 'password123', passwordConfirm: 'password123' })
      });
      if (res.ok) console.log('Admin created');
      else console.log('Admin creation skipped/failed', await res.text());
  } catch (e) {
      console.log('Admin creation error', e);
  }

  // 2. Auth Admin
  const authRes = await fetch(`${baseUrl}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'admin@local.host', password: 'password123' })
  });
  const authData = await authRes.json();
  const token = authData.token;
  
  if (!token) {
      console.error('Failed to get token', authData);
      process.exit(1);
  }

  // 3. Create Invoices Collection
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

  const colRes = await fetch(`${baseUrl}/api/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(invoicesSchema)
  });
  
  if (colRes.ok) console.log('Invoices collection created');
  else console.log('Invoices collection creation failed (maybe exists)', await colRes.text());
  
  // 4. Create Users
  // Me
  await createUser(token, 'me@local.host', '1234567890', 'Me');
  // Accountant
  await createUser(token, 'accountant@local.host', '1234567890', 'Accountant');
}

async function createUser(token, email, password, name) {
    const res = await fetch(`${baseUrl}/api/collections/users/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ email, password, passwordConfirm: password, name, emailVisibility: true, verified: true })
    });
    if (res.ok) console.log(`User ${email} created`);
    else console.log(`User ${email} creation skipped/failed`, await res.statusText); // Don't log full error for duplicate email as it's common
}

main();
