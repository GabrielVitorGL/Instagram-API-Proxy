import { IgApiClient } from 'instagram-private-api';
import fs from 'fs';
import path from 'path';

const ig = new IgApiClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    const userId = await ig.user.getIdByUsername(username);

    const pdfPath = path.resolve('./public', 'ebook.pdf');

    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file not found.');
    }

    await ig.entity.directThread([userId]).broadcastFile({
      file: fs.readFileSync(pdfPath),
      filename: 'ebook.pdf',
    });

    return res.status(200).json({ message: `PDF enviado para ${username}.` });
  } catch (error) {
    console.error('Error sending PDF:', error.message);
    return res.status(500).json({
      error: 'Failed to send PDF',
      details: error.message,
    });
  }
}
