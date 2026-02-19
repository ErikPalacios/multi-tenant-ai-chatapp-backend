const axios = require('axios');

async function testAuth() {
  try {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    
    // Test Registration
    console.log('Testing registration...');
    const registerResponse = await axios.post('http://localhost:3001/auth/register-owner', {
      email: testEmail,
      password: password,
      businessName: 'Node Test Business',
      whatsappConfig: {
        phone: '1234567890',
        platform: 'meta'
      }
    });
    
    console.log('Registration Response Status:', registerResponse.status);
    console.log('Registration Token:', registerResponse.data.token ? 'Yes' : 'No');
    
    // Test Login
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      email: testEmail,
      password: password
    });
    
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Token:', loginResponse.data.token ? 'Yes' : 'No');
    
    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
}

testAuth();
