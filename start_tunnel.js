const localtunnel = require('localtunnel');

async function launchTunnel() {
  const subdomains = ['campus-orbit-ai', 'campus-orbit', 'campusorbit-live', 'campusorbit'];
  let tunnel = null;

  for (const sub of subdomains) {
    try {
      console.log('Attempting custom branded subdomain: ' + sub);
      tunnel = await localtunnel({ port: 8000, subdomain: sub });
      console.log('SUCCESS_URL:' + tunnel.url);
      break;
    } catch (err) {
      console.log('Error with ' + sub + ': ' + err.message);
    }
  }

  if (!tunnel) {
    tunnel = await localtunnel({ port: 8000 });
    console.log('SUCCESS_URL:' + tunnel.url);
  }

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
}

launchTunnel();
