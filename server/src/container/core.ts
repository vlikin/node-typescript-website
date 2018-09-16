import {inject, injectable} from "inversify";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {CType, IConfig, ITokenData} from "../declaration";

@injectable()
export class CoreContainer {
    constructor(
        @inject(CType.Config)
        private config: IConfig
    ) {}

    generateHash(word: string): string {
        return bcrypt.hashSync(word, bcrypt.genSaltSync(8));
    }

    validateHash(word: string, hash: string): boolean {
        return bcrypt.compareSync(word, hash);
    }

    generateToken(data: ITokenData): string {
        return jwt.sign(data, this.config.secret);
    }

    decodeToken(token: string): ITokenData {
        return <ITokenData>jwt.verify(token, this.config.secret);
    }

}
