import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountParams } from "../../../../domain/usecases/account/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const { insertedId } = result;
    const account = await accountCollection.findOne({ _id: insertedId });
    return MongoHelper.mapId(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    if (!account) {
      return null;
    }

    return MongoHelper.mapId(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const objId = new ObjectId(id);
    await accountCollection.updateOne(
      {
        _id: objId,
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role,
        },
        {
          role: "admin",
        },
      ],
    });
    if (!account) {
      return null;
    }

    return MongoHelper.mapId(account);
  }
}
