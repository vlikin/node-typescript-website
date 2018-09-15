import {inject, injectable} from "inversify";
import {AbstractCommand} from './core/command';
import {CType, IConfig} from "./declaration";
import 'colors';
import inquirer from 'inquirer';
import {ShellContainer} from "./container/shell";
import {DynamicConfigMemento} from "./memento";
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import {IPostData, PostModel} from "./model/post";

@injectable()
export class InstallCommand extends AbstractCommand {
    constructor(
        @inject(CType.Shell)
        private shellContainer: ShellContainer
    ) {
        super();
    }

    info() {
        return {
            command: 'install',
            description: 'The fist install',
        }
    }

    async command() {
        console.log('You are going to install the application! It can destroy some data.'.red);
        const questions = [
            { type: 'confirm', name: 'continue', message: 'Do you want to continue the application installation?', default: false },
        ];
        let answers = await inquirer.prompt<{continue: boolean}>(questions);
        if (answers.continue){
            await this.shellContainer.install();
            await this.shellContainer.dispose();
            console.log('The application has been installed successfully.'.green);
        }
    }
}

@injectable()
export class UninstallCommand extends AbstractCommand {
    constructor(
        @inject(CType.Shell)
        private shellContainer: ShellContainer
    ) {
        super();
    }

    info() {
        return {
            command: 'uninstall',
            description: 'The application un-installation',
        }
    }

    async command() {
        console.log('You are going to uninstall the application! It can destroy some data.'.red);
        const questions = [
            { type: 'confirm', name: 'continue', message: 'Do you want to continue the application un-installation?', default: false },
        ];
        let answers = await inquirer.prompt<{continue: boolean}>(questions);
        if (answers.continue){
            await this.shellContainer.uninstall();
            await this.shellContainer.dispose();
            console.log('The application has been uninstalled successfully.'.green);
        }
    }
}

@injectable()
export class ReinstallCommand extends AbstractCommand {
    @inject(CType.Shell)
    private shellContainer!: ShellContainer

    constructor() {
        super();
    }

    info() {
        return {
            command: 'reinstall',
            description: 'The application re-installation',
        }
    }

    async command() {
        console.log('You are going to reinstall the application! It can destroy some data.'.red);
        const questions = [
            { type: 'confirm', name: 'continue', message: 'Do you want to continue the application re-installation?', default: false },
        ];
        let answers = await inquirer.prompt<{continue: boolean}>(questions);
        if (answers.continue) {
            await this.shellContainer.uninstall();
            await this.shellContainer.install();
            await this.shellContainer.dispose();
            console.log('The application has been reinstalled successfully.'.green);
        }
    }
}

@injectable()
export class ChangeAdminPasswordCommand extends AbstractCommand {
    @inject(CType.Memento.DynamicConfig)
    private dynamicConfig!: DynamicConfigMemento;
    @inject(CType.Shell)
    private shellContainer!: ShellContainer;

    info() {
        return {
            command: 'admin-password',
            description: 'Resets the admin password.',
            options: []
        }
    }

    async command(env: any, options: any): Promise<void> {
        const questions = [
            {
                type: 'password',
                message: 'Enter new admin password',
                name: 'password',
                mask: '*',
            }
        ];
        let answers = await inquirer.prompt<{password: string}>(questions);
        let state = await this.dynamicConfig.getState();
        state.adminPassword = answers.password;
        await this.dynamicConfig.setState(state);
        console.log('Admin password has been changed!'.red);
        await this.shellContainer.dispose()
    }
}


@injectable()
export class InitialDataCommand extends AbstractCommand {
    @inject(CType.Config)
    private config!: IConfig;
    @inject(CType.Memento.DynamicConfig)
    private dynamicConfig!: DynamicConfigMemento;
    @inject(CType.Content.Post)
    private postModel!: PostModel;
    @inject(CType.Shell)
    private shellContainer!: ShellContainer;

    info() {
        return {
            command: 'initial-data',
            description: 'Sets initial data.',
            options: []
        }
    }

    async command(env: any, options: any): Promise<void> {
        // await this.shellContainer.uninstall();
        // await this.shellContainer.install();

        const postFile = 'yaml/section/blog.yaml';
        console.log(path.resolve(postFile));
        let doc = yaml.safeLoad(fs.readFileSync(postFile, 'utf8'));
        doc['ua'] = doc['uk'];
        delete doc['uk'];
        let posts: IPostData[] = [];
        for (let i = 0; i < doc['en']['articles'].length; i++) {
            let defArticle = doc['en']['articles'][i];
            let post: IPostData = {
                link: defArticle.href,
                date: new Date(),
                translations: {}
            };
            this.config.languages.forEach((language) => {
               let oldPost = doc[language]['articles'][i];
               post.translations[language] = oldPost['title'];
            });
            posts.push(post);
        }
        posts.forEach(async (post) => {
           return await this.postModel.create(post)
        });

        console.log('Posts have been migrated!'.red);
    }
}
