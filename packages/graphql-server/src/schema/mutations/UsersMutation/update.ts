import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context, UploadedFile } from '@via-profit-services/core';

import { FileType } from 'files';
import { AccountStatus, AccountRole } from 'users';
import UserUpdateResponse from '~/schema/unions/UserUpdateResponse';
import UserUpdateInput from '~/schema/inputs/UserUpdateInput';

interface Args {
  readonly id: string;
  readonly input: {
    readonly name?: string | null;
    readonly avatar?: UploadedFile | null;
    readonly files?: UploadedFile[] | null;
    readonly filesInfo?: ReadonlyArray<{
      readonly type: FileType;
      readonly id?: string | null;
      readonly name: string;
      readonly description?: string | null;
      readonly meta?: JSON | null;
    }> | null;
    readonly account?: {
      readonly id: string;
      readonly login?: string;
      readonly password?: string;
      readonly status?: AccountStatus;
      readonly roles?: ReadonlyArray<AccountRole>;
    } | null;
  };
}

const update: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(UserUpdateResponse),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(UserUpdateInput) },
  },
  resolve: async (_parent, args, context) => {
    const { id, input } = args;
    const { account, avatar, files, filesInfo, ...userData } = input;
    const { services, emitter, dataloader, pubsub } = context;
    const logTag = 'users';

    if (typeof files !== 'undefined' && typeof filesInfo === 'undefined') {
      return {
        __typename: 'UserUpdateError',
        name: 'MissingFilesInfo',
        msg: `When uploading files, you must pass an variable «filesInfo», but got «${filesInfo}»`,
      };
    }

    if (typeof filesInfo !== 'undefined' && typeof files === 'undefined') {
      return {
        __typename: 'UserUpdateError',
        name: 'MissingFiles',
        msg: `When passing the «filesInfo» variable, you must pass the «files» variable, but got «${typeof files}»`,
      };
    }

    if (
      typeof files !== 'undefined' &&
      typeof filesInfo !== 'undefined' &&
      files.length !== filesInfo.length
    ) {
      return {
        __typename: 'UserUpdateError',
        name: 'FilesMismatch',
        msg: `The number of files must correspond to the number of elements of the «filesInfo» variable`,
      };
    }

    const originalUserData = await dataloader.users.load(id);
    dataloader.users.clear(id);

    if (!originalUserData) {
      return {
        __typename: 'UserUpdateError',
        name: 'UserNotFound',
        msg: 'User does not found',
      };
    }

    if (typeof userData === 'object' && Object.keys(userData).length) {
      try {
        await services.users.updateUser(id, userData);
      } catch (err) {
        emitter.emit('log-error', logTag, err);

        return {
          __typename: 'UserUpdateError',
          name: 'UnknownError',
          msg: 'Unknown error',
        };
      }
    }

    if (typeof avatar !== 'undefined' && avatar !== null) {
      if (originalUserData.avatar) {
        try {
          await services.files.deleteFiles([originalUserData.avatar]);
        } catch (err) {
          emitter.emit('log-error', logTag, err);
        }
      }

      try {
        const { createReadStream, mimeType } = await avatar;
        await services.files.createFile(createReadStream(), {
          type: 'AVATAR',
          mimeType,
          owner: id,
          name: 'avatar',
          access: {
            del: ['viewer'],
            read: ['viewer'],
            write: ['viewer'],
          },
        });
      } catch (err) {
        emitter.emit('log-error', logTag, err);

        return {
          __typename: 'UserUpdateError',
          name: 'UnknownError',
          msg: 'Unknown error',
        };
      }
    }
    if (files && filesInfo) {
      try {
        const filesPayloads = await Promise.all(files);

        await Promise.all(
          filesPayloads.map(async (payload, index) => {
            const { createReadStream, mimeType } = payload;
            await services.files.createFile(createReadStream(), {
              ...filesInfo[index],
              access: {
                read: ['viewer'],
                del: ['administrator'],
                write: ['administrator'],
              },
              mimeType,
              owner: id,
            });
          }),
        );
      } catch (err) {
        emitter.emit('log-error', logTag, err);

        return {
          __typename: 'UserUpdateError',
          name: 'UnknownError',
          msg: 'Unknown error',
        };
      }
    }

    const updatedUser = await dataloader.users.load(id);

    // Fire subscriptions
    pubsub.publish('user-was-updated', {
      userWasUpdated: updatedUser,
    });

    return {
      __typename: 'UserUpdateSuccess',
      user: updatedUser,
    };
  },
};

export default update;
