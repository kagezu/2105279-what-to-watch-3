import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.green(`
        Программа для подготовки данных для REST API сервера.`), `
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   `, chalk.yellow('# выводит номер версии'), `
            --help:                      `, chalk.yellow('# печатает этот текст'), `
            --import <path>:             `, chalk.yellow('# импортирует данные из TSV'), `
            --generate <n> <path> <url>  `, chalk.yellow('# генерирует произвольное количество тестовых данных'), `
        `);
  }
}
