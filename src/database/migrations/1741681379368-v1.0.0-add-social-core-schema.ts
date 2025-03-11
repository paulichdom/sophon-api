const { Table: TypeormTable, TableIndex, TableForeignKey, TableColumn } = require('typeorm');

module.exports = class V100AddSocialCoreSchema1741681379368 {
    name = 'V100AddSocialCoreSchema1741681379368'

    async up(queryRunner) {
        // Create Profile table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'profile',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'bio',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
            }),
        );

        // Create Comment table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'comment',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'body',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'authorId',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'articleId',
                        type: 'integer',
                        isNullable: true,
                    },
                ],
            }),
        );

        // Create Article table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'article',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        default: "''",
                        isNullable: false,
                    },
                    {
                        name: 'body',
                        type: 'varchar',
                        default: "''",
                        isNullable: false,
                    },
                    {
                        name: 'favoritesCount',
                        type: 'integer',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'authorId',
                        type: 'integer',
                        isNullable: true,
                    },
                ],
            }),
        );

        // Create Tag table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'tag',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                ],
            }),
        );

        // Create user_roles junction table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'user_roles',
                columns: [
                    {
                        name: 'userId',
                        type: 'integer',
                        isPrimary: true,
                    },
                    {
                        name: 'roleId',
                        type: 'integer',
                        isPrimary: true,
                    },
                ],
            }),
        );

        // Create user_favorited_articles junction table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'user_favorited_articles',
                columns: [
                    {
                        name: 'userId',
                        type: 'integer',
                        isPrimary: true,
                    },
                    {
                        name: 'articleId',
                        type: 'integer',
                        isPrimary: true,
                    },
                ],
            }),
        );

        // Create user_followers junction table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'user_followers',
                columns: [
                    {
                        name: 'followingId',
                        type: 'integer',
                        isPrimary: true,
                    },
                    {
                        name: 'followerId',
                        type: 'integer',
                        isPrimary: true,
                    },
                ],
            }),
        );

        // Create article_tags junction table
        await queryRunner.createTable(
            new TypeormTable({
                name: 'article_tags',
                columns: [
                    {
                        name: 'articleId',
                        type: 'integer',
                        isPrimary: true,
                    },
                    {
                        name: 'tagId',
                        type: 'integer',
                        isPrimary: true,
                    },
                ],
            }),
        );

        // Modify User table
        await queryRunner.dropColumn('user', 'bio');
        await queryRunner.dropColumn('user', 'image');
        
        await queryRunner.addColumns('user', [
            new TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'now()',
                isNullable: false,
            }),
            new TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'now()',
                isNullable: false,
            }),
            new TableColumn({
                name: 'profileId',
                type: 'integer',
                isNullable: true,
                isUnique: true,
            }),
        ]);

        // Add all foreign key constraints
        await queryRunner.createForeignKey('comment', new TableForeignKey({
            name: 'FK_276779da446413a0d79598d4fbd',
            columnNames: ['authorId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('comment', new TableForeignKey({
            name: 'FK_c20404221e5c125a581a0d90c0e',
            columnNames: ['articleId'],
            referencedTableName: 'article',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('user', new TableForeignKey({
            name: 'FK_9466682df91534dd95e4dbaa616',
            columnNames: ['profileId'],
            referencedTableName: 'profile',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('article', new TableForeignKey({
            name: 'FK_a9c5f4ec6cceb1604b4a3c84c87',
            columnNames: ['authorId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('user_roles', new TableForeignKey({
            name: 'FK_472b25323af01488f1f66a06b67',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));

        await queryRunner.createForeignKey('user_roles', new TableForeignKey({
            name: 'FK_86033897c009fcca8b6505d6be2',
            columnNames: ['roleId'],
            referencedTableName: 'role',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('user_favorited_articles', new TableForeignKey({
            name: 'FK_1ef8b9519fe1b0dc7951a943c7d',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));

        await queryRunner.createForeignKey('user_favorited_articles', new TableForeignKey({
            name: 'FK_b3d5614c1d624d647f8680fd394',
            columnNames: ['articleId'],
            referencedTableName: 'article',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('user_followers', new TableForeignKey({
            name: 'FK_b319cdc26936df06bca3feb3bc2',
            columnNames: ['followingId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));

        await queryRunner.createForeignKey('user_followers', new TableForeignKey({
            name: 'FK_c3f56a3157b50bc8adcc6acf278',
            columnNames: ['followerId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));

        await queryRunner.createForeignKey('article_tags', new TableForeignKey({
            name: 'FK_acbc7f775fb5e3fe2627477b5f7',
            columnNames: ['articleId'],
            referencedTableName: 'article',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));

        await queryRunner.createForeignKey('article_tags', new TableForeignKey({
            name: 'FK_83a0534713c9e7f6bb2110c7bcc',
            columnNames: ['tagId'],
            referencedTableName: 'tag',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        }));
    }

    async down(queryRunner) {
        // Drop foreign keys
        await queryRunner.dropForeignKey('article_tags', 'FK_83a0534713c9e7f6bb2110c7bcc');
        await queryRunner.dropForeignKey('article_tags', 'FK_acbc7f775fb5e3fe2627477b5f7');
        await queryRunner.dropForeignKey('user_followers', 'FK_c3f56a3157b50bc8adcc6acf278');
        await queryRunner.dropForeignKey('user_followers', 'FK_b319cdc26936df06bca3feb3bc2');
        await queryRunner.dropForeignKey('user_favorited_articles', 'FK_b3d5614c1d624d647f8680fd394');
        await queryRunner.dropForeignKey('user_favorited_articles', 'FK_1ef8b9519fe1b0dc7951a943c7d');
        await queryRunner.dropForeignKey('user_roles', 'FK_86033897c009fcca8b6505d6be2');
        await queryRunner.dropForeignKey('user_roles', 'FK_472b25323af01488f1f66a06b67');
        await queryRunner.dropForeignKey('article', 'FK_a9c5f4ec6cceb1604b4a3c84c87');
        await queryRunner.dropForeignKey('user', 'FK_9466682df91534dd95e4dbaa616');
        await queryRunner.dropForeignKey('comment', 'FK_c20404221e5c125a581a0d90c0e');
        await queryRunner.dropForeignKey('comment', 'FK_276779da446413a0d79598d4fbd');

        // Drop indices
        await queryRunner.dropIndex('article_tags', 'IDX_83a0534713c9e7f6bb2110c7bc');
        await queryRunner.dropIndex('article_tags', 'IDX_acbc7f775fb5e3fe2627477b5f');
        await queryRunner.dropIndex('user_followers', 'IDX_c3f56a3157b50bc8adcc6acf27');
        await queryRunner.dropIndex('user_followers', 'IDX_b319cdc26936df06bca3feb3bc');
        await queryRunner.dropIndex('user_favorited_articles', 'IDX_b3d5614c1d624d647f8680fd39');
        await queryRunner.dropIndex('user_favorited_articles', 'IDX_1ef8b9519fe1b0dc7951a943c7');
        await queryRunner.dropIndex('user_roles', 'IDX_86033897c009fcca8b6505d6be');
        await queryRunner.dropIndex('user_roles', 'IDX_472b25323af01488f1f66a06b6');

        // Drop tables
        await queryRunner.dropTable('article_tags');
        await queryRunner.dropTable('user_followers');
        await queryRunner.dropTable('user_favorited_articles');
        await queryRunner.dropTable('user_roles');
        await queryRunner.dropTable('tag');
        await queryRunner.dropTable('article');
        await queryRunner.dropTable('comment');
        await queryRunner.dropTable('profile');

        // Restore user table columns
        await queryRunner.addColumns('user', [
            new TableColumn({
                name: 'bio',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'image',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
    }
};
