import { version } from 'node:process';

const MIN_NODE_VERSION = 18;

export const getNodeVersion = () => {
  const nodeVersion = version.replace('v', '');
  const [major, minor, patch] = nodeVersion.split('.');

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    version: nodeVersion,
  };
};

export const isSupportedNodeVersion = () => {
  const { major } = getNodeVersion();

  return major >= MIN_NODE_VERSION;
};
