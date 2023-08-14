const DEFAULT_PORT = 5000;

function getServerPort() {
  const port = Number(process.env.PORT);
  console.log(process.env.PORT);
  console.log(`port: ${port}`);

  if (!isNaN(port)) {
    return port;
  }

  return DEFAULT_PORT;
}

export const server = {
  port: getServerPort()
};
