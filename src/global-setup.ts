import dotenv from 'dotenv';

async function globalSetup(): Promise<void> {
  dotenv.config({ override: true }); //to overwrite the environment variable from the system with the env file
  //   console.log('⚠️  URL:', process.env.BASE_URL);
}

export default globalSetup;
