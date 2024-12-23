import 'dotenv/config';
import { IgApiClient } from 'instagram-private-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username query parameter is required' });
  }

  const ig = new IgApiClient();

  try {
    ig.state.generateDevice(process.env.IG_USERNAME);

    if (process.env.IG_PROXY) {
      ig.state.proxyUrl = process.env.IG_PROXY;
    }

    const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log(`Logado como: ${auth.username}`);

    const userId = await ig.user.getIdByUsername(username);
    if (!userId) {
      return res.status(404).json({ error: `User "${username}" not found.` });
    }

    const userInfo = await ig.user.info(userId);
    if (!userInfo) {
      return res.status(500).json({ error: 'Failed to retrieve user info.' });
    }

    const followersCount = userInfo.follower_count || 0;

    return res.status(200).json({
      username: userInfo.username,
      fullName: userInfo.full_name,
      followers: followersCount,
    });
  } catch (error) {
    console.error('Erro ao consultar perfil:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch user info',
      details: error.message,
    });
  }
}
