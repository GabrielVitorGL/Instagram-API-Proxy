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

  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY || null;

  try {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    const userId = await ig.user.getIdByUsername(username);

    const userInfo = await ig.user.info(userId);

    const followersCount = userInfo.follower_count;

    console.log(followersCount);
    return res.status(200).json({
      username: userInfo.username,
      fullName: userInfo.full_name,
      followers: followersCount,
    });
  } catch (error) {
    console.error('Erro ao consultar perfil:', error.message);
    return res.status(500).json({ error: 'Failed to fetch user info', details: error.message });
  }
}
