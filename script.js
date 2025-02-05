import { IExecDataProtector } from '@iexec/dataprotector';
import Web3 from 'web3';

// Initialize an empty object to store our JSON
let jsonObject = {};

// Function to update protect button state
function updateProtectButtonState() {
    const protectButton = document.getElementById('protectData');
    protectButton.disabled = Object.keys(jsonObject).length === 0;
}

// Initialize DataProtector when the page loads
window.addEventListener('load', async function() {
    try {
        // Create Web3 provider
        const web3 = new Web3(window.ethereum || "http://localhost:8545");
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize DataProtector with Web3 provider
        const dataProtector = new IExecDataProtector(web3.currentProvider);
        console.log('DataProtector initialized successfully');
        
        // Initially disable protect button
        const protectButton = document.getElementById('protectData');
        protectButton.disabled = true;
        
        // Add click handler for protect button
        protectButton.addEventListener('click', async function() {
            console.log('Protect button clicked');
            console.log('Current JSON:', jsonObject);
            
            try {
                const protectedData = await dataProtector.protectData({
                    data: jsonObject
                });
                console.log('Protected data:', protectedData);
                
                // Show protected output container
                document.getElementById('protectedOutput').style.display = 'block';
                
                // Display protected data
                document.getElementById('protectedJson').innerHTML = JSON.stringify(protectedData, null, 2);
            } catch (error) {
                console.error('Error protecting data:', error);
                alert('Error protecting data: ' + error.message);
            }
        });
    } catch (error) {
        console.error('Error initializing DataProtector:', error);
        alert('Error initializing data protection. Please make sure you have MetaMask installed and try refreshing the page.');
    }
});

document.getElementById('jsonForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const key = document.getElementById('key').value;
    const value = document.getElementById('value').value;
    
    // Add to JSON object
    jsonObject[key] = value;
    
    // Update the JSON display
    document.getElementById('jsonOutput').innerHTML = JSON.stringify(jsonObject, null, 2);
    
    // Enable protect button
    updateProtectButtonState();
    
    // Clear inputs
    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
});

document.getElementById('clearJson').addEventListener('click', function() {
    jsonObject = {};
    document.getElementById('jsonOutput').innerHTML = '{}';
    document.getElementById('protectedOutput').style.display = 'none';
    document.getElementById('protectedJson').innerHTML = '';
    updateProtectButtonState();
});
