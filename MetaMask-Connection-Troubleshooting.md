# MetaMask Connection Troubleshooting

## 🔍 **Why MetaMask Isn't Requesting Signature**

### **Possible Causes:**

1. **Auto-Connect Enabled** ✅ **FIXED**
   - **Problem**: wagmi `autoConnect: true` bypassed signature prompt
   - **Solution**: Set `autoConnect: false` in wagmi config

2. **Cached Connection**
   - **Problem**: MetaMask/wagmi remembers previous connection
   - **Solution**: Clear localStorage and force disconnect

3. **Already Connected**
   - **Problem**: MetaMask is already connected to the site
   - **Solution**: Manual disconnect in MetaMask

4. **Permission Already Granted**
   - **Problem**: Site already has permission to access accounts
   - **Solution**: Revoke permissions in MetaMask settings

## 🛠️ **Debugging Steps:**

### **1. Check Debug Information**
- Look at the **Debug Wallet State** panel (only visible in development)
- Check if `isConnected` is already `true`
- Verify `connectors` are properly loaded

### **2. Clear All Connections**
- Click **"Force Disconnect & Refresh"** button (development only)
- This clears all cached data and refreshes the page

### **3. Manual MetaMask Reset**
1. Open MetaMask
2. Go to Settings → Connected Sites
3. Find your localhost site and disconnect
4. Go to Settings → Advanced → Reset Account (if needed)

### **4. Browser Storage Reset**
1. Open DevTools → Application → Storage
2. Clear localStorage for your domain
3. Clear sessionStorage
4. Refresh the page

## ⚙️ **Configuration Changes Made:**

### **wagmi.ts Updates:**
```typescript
export const config = createConfig({
  autoConnect: false,  // ✅ Forces signature prompt
  connectors: [
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,  // ✅ Proper disconnect
        UNSTABLE_shimOnConnectSelectAccount: true,  // ✅ Account selection
      }
    }),
  ],
  publicClient,
});
```

### **WalletConnect.tsx Updates:**
- ✅ Added connection error handling
- ✅ Added localStorage clearing on disconnect
- ✅ Added debug components (development only)
- ✅ Added toast notifications for all actions

## 🔄 **Expected Flow:**

1. **Click "Connect MetaMask"**
2. **MetaMask popup appears**
3. **Select account**
4. **Approve connection**
5. **Sign message** (if required by app)
6. **Connection established**

## 🚨 **If Still Not Working:**

### **Check MetaMask:**
1. Update MetaMask to latest version
2. Check if MetaMask is unlocked
3. Verify you're on the correct network
4. Try in incognito/private browsing mode

### **Check Browser:**
1. Disable other wallet extensions
2. Clear all browser data for localhost
3. Try a different browser
4. Check browser console for errors

### **Reset Everything:**
1. Use "Force Disconnect & Refresh" button
2. Manually disconnect in MetaMask
3. Clear browser storage
4. Restart browser
5. Try connecting again

## 📝 **Debug Commands:**

Open browser console and run:
```javascript
// Check if MetaMask is available
console.log('MetaMask available:', !!window.ethereum);

// Check current accounts
window.ethereum?.request({ method: 'eth_accounts' }).then(console.log);

// Check permissions
window.ethereum?.request({ method: 'wallet_getPermissions' }).then(console.log);

// Force account prompt (will fail if already connected)
window.ethereum?.request({ method: 'eth_requestAccounts' }).then(console.log);
```

## 🎯 **Current Status:**
- ✅ `autoConnect` disabled
- ✅ Proper disconnect handling
- ✅ Debug tools added
- ✅ Force disconnect option
- ✅ Toast notifications
- ✅ Error handling

The connection should now properly prompt for signature when clicking "Connect MetaMask".