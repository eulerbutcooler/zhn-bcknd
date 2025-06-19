import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

const endpointId = process.env.ENDPOINT_ID;
const project = process.env.PROJECT_ID;
const location = "asia-south1";

export default async function ttsDia(script: string) {
  const endpoint = `https://${endpointId}.${location}-${project}.prediction.vertexai.goog/v1/projects/${project}/locations/${location}/endpoints/${endpointId}:predict`;

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();
const tokenResponse = await client.getAccessToken();
const accessToken = typeof tokenResponse === 'string'
  ? tokenResponse
  : tokenResponse?.token;

  const body = {
    "instances": [
      { "text": script }
    ],
    "parameters": {
      "cfg_scale": 0.3,
      "temperature": 1.3,
      "top_p": 0.95,
    }
  };

  const response = await axios.post(endpoint, body, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

const audioBase64 = response.data.predictions?.[0]?.audio;
if (!audioBase64) throw new Error('No audio data returned from TTS model');
return Buffer.from(audioBase64, 'base64');
}