import boxen from 'boxen';
import figlet from 'figlet';
import chalk from 'chalk';

export const logNslBanner = () => {
  const box = boxen(chalk.magenta(figlet.textSync('- NSL -', { horizontalLayout: 'full' })), {
    borderColor: 'cyan',
    borderStyle: 'classic',
    margin: 1,
    padding: 1,
    textAlignment: 'center',
    title: 'Node Script List',
    titleAlignment: 'center',
  });

  console.log(box);
};
