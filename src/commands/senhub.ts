import { Command, flags } from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'
import { execSync } from 'child_process'

const REPOS: Record<string, string> = {
  senhub: 'git@github.com:DescartesNetwork/senhub.git',
}

export default class SenHub extends Command {
  static description = 'To build a DApp on Sentre Ecosystem'

  static args = [{ name: 'project' }]

  static flags = {
    help: flags.help({ char: 'h' }),
    template: flags.string({
      char: 't',
      description: 'Choose template. Default: senhub',
    }),
    force: flags.boolean({
      char: 'f',
      description: 'Force to overwrite the output',
    }),
  }

  async run() {
    const { args, flags } = this.parse(SenHub)

    if (!args.project) return this.error('Enter the project name')

    const project = path.join(process.cwd(), args.project)
    const template = flags.template ?? 'senhub'

    if (fs.existsSync(project) && !flags.force) {
      return this.error(
        `The project ${project} that already existed. Please change another name and try again!`,
      )
    } else {
      fs.removeSync(project)
    }

    this.log('\n👏👏👏 Welcome Sentizen!\n')
    const spinner = require('ora')('Building the project...\n').start()
    execSync(`git clone ${REPOS[template]} ${args.project}`, {
      stdio: 'inherit',
    })
    execSync('git remote rename origin senhub', {
      cwd: project,
      stdio: 'inherit',
    })
    execSync('npm install', { cwd: project, stdio: 'inherit' })
    execSync('rm ./.github/workflows/main.yml', { cwd: project, stdio: 'inherit' })
    execSync('mv ./.github/template/app.yml ./.github/workflows/main.yml', { cwd: project, stdio: 'inherit' })
    spinner.succeed('The project has been created!')
    this.log('Check it out!', project)
  }
}
