---
pageClass: blog-page
title: Next.js 使用 Drizzle-ORM
tags:
  - web
  - next.js
  - drizzle-orm
date: 2025-07-21
author: cp3hnu
location: ChangSha
summary: Drizzle ORM 是一个专为现代 TypeScript 项目设计的轻量级 ORM，它不仅具备静态类型推导、极低的学习成本，还原生支持 SQL。这篇文章将结合我的实际开发经验，介绍在 Next.js 项目中如何集成 Drizzle ORM，并展示它在开发体验和可维护性方面带来的提升。
---

# Next.js 使用 Drizzle-ORM

上篇文章 [使用 Next.js 创建 Web 应用](/2025/05/01/nextjs-web/) 中，我们的 Next.js 项目使用了 [`postgres.js`](https://github.com/porsager/postgres) 管理 PostgreSQL。 [`postgres.js`](https://github.com/porsager/postgres)  是通过手写 SQL 与数据库交互。虽然这种方式灵活且性能高，但随着项目复杂度的上升，手写 SQL 带来的可维护性、类型安全、数据库迁移等问题也逐渐暴露出来。

我开始寻找一种既具备类型安全、良好的开发体验，又不丢失原生 SQL 灵活性的 ORM 工具。最终，我选择了 [Drizzle ORM](https://orm.drizzle.team/) —— 一个专为现代 TypeScript 项目设计的轻量级 ORM，它不仅具备静态类型推导、极低的学习成本，还原生支持 SQL。

这篇文章将结合我的实际开发经验，介绍在 Next.js 项目中如何集成 Drizzle ORM，并展示它在开发体验和可维护性方面带来的提升。

## 连接数据库

Drizzle-ORM 支持多种数据库的连接。

![](./assets/drizzle-database.png)

因为我们使用的是 PostgreSQL，这里介绍一下 Drizzle-ORM 怎么连接 PostgreSQL。Drizzle-ORM 支持通过 [`node-postgres`](https://github.com/brianc/node-postgres) 和 [`postgres.js`](https://github.com/porsager/postgres) 连接 PostgreSQL。

### 使用 `node-postgres`

1. 安装 `node-postgres`

```sh
$ npm i drizzle-orm pg
$ npm i -D drizzle-kit @types/pg
```

[Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) 是一个 Drizzle-ORM 用来管理 SQL 数据库迁移的 CLI 工具。

2. 创建  `.env` 文件，添加环境变量

```
DATABASE_URL=postgres://username:password@host:port/db-name
```

3. 将 Drizzle-ORM 连接到数据库

```ts
// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
                   
const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
});

export default db;
```

`casing: "snake_case"` 表示将数据库表列（column）使用 `snake_case` 格式命名，而对应的  JS 对象属性使用 `camelCase` 格式命名，比如数据库表列名是 `created_at`，对应的  JS 对象属性名称是 `createdAt`。更多详情请参考 [Camel and Snake casing](https://orm.drizzle.team/docs/sql-schema-declaration#camel-and-snake-casing)。

4. 创建表结构文件（schema）

Drizzle-ORM 支持单个或多个 `schema` 文件。 

```ts
// src/db/schema.ts
import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  completed: boolean().default(false),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});
```

我这里创建了两张表：一张用户表（`users`）、一张任务表（`tasks`）。关于创建表的详细介绍请看下面的 [创建表](#创建表) 章节。

5. 创建 Drizzle-ORM 配置文件

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/app/db/schema.ts", // 如果是多个 `schema` 文件，这里设置文件夹路径 `./src/app/db/schema`
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: "snake_case",
});
```

这个配置文件包含了有关数据库连接、迁移文件夹（`out`）、数据库表结构文件（`schema`）以及列名转换（`casing`）等信息。[Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) 将使用这个配置文件创建数据库表以及进行数据库迁移。

6. 创建数据库表

```sh
$ npx drizzle-kit push
```

[Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) 不仅可以创建数据库表，它更大的用处是进行数据库迁移，后面会讲到。

### 使用 `postgres.js`

如果是使用 `postgres.js`，其连接过程大致是一样的，除了第 1 步和第 3 步。

1. 安装 `postgres.js`

```sh
$ npm i drizzle-orm postgres
$ npm i -D drizzle-kit
```

3. 将 Drizzle-ORM 连接到数据库

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
});

export default db;
```

自此，我们成功连接了 PostgreSQL 数据库。接下来我们看一下常用的数据库操作。

## 创建表

在前面连接数据库章节中，我创建了两张表：一张用户表（`users`）、一张任务表（`tasks`）

```ts
// src/db/schema.ts
import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  completed: boolean().default(false),
  createdAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`),
  updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
    .notNull()
    .default(sql`(now() at time zone 'utc')`)
    .$onUpdate(() => new Date()),
});
```

接下来我将详细介绍 Drizzle-ORM 怎么创建表。

### 列数据类型

数据库表的每一列都需要指定一个数据类型，比如整型、字符串、布尔类型等等。Drizzle-ORM 提供了对应的数据类型函数，比如 `integer()`、`varchar()`、`boolean()`、`text()`、`timestamp()` 等等，更多类型及使用方式请参考 [PostgreSQL column types](https://orm.drizzle.team/docs/column-types/pg)。

#### 时间类型

时间类型 `timestamp` 需要注意一下。默认 `timestamp` 是带有时区的，即 `updatedAt` 初始插入是本地时区时间。这个本来也没有问题，但是如果使用 `.$onUpdate(() => new Date())` 自动更新时，时间将变成 UTC 时间，从而导致时间不一致。这个有很多解决办法，但是我任务最好的解决办法是统一为 UTC 时间。

```ts
updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
  .notNull()
  .default(sql`(now() at time zone 'utc')`)
  .$onUpdate(() => new Date()),
```

`withTimezone: false` 表示不带时区。

`.default(sql(now() at time zone 'utc'))` 初始插入时，使用 UTC 时间。

#### 枚举类型

Drizzle-ORM 支持枚举值，但是用法有些许差别，需要使用 `pgEnum` 定义枚举值。

```ts
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
export const moodEnum = pgEnum('mood', ['sad', 'ok', 'happy']);
export const table = pgTable('table', {
  mood: moodEnum(),
});
```

```sql
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE IF NOT EXISTS "table" (
	"mood" mood
);
```

#### 自定义类型

Drizzle-ORM 支持自定义类型，使用 `.$type()` 方法

```ts
type UserId = number & { __brand: 'user_id' };
type Data = {
	foo: string;
	bar: number;
};
const users = pgTable('users', {
  id: serial().$type<UserId>().primaryKey(),
  jsonField: json().$type<Data>(),
});
```

#### 标识列（Identity Columns）

PostgreSQL 支持使用标识列来自动为列生成唯一的整数值。这些值使用序列生成，可以使用 `GENERATED AS IDENTITY` 子句进行定义。

- `GENERATED ALWAYS AS IDENTITY` ：数据库始终会为该列生成一个值。除非使用 `OVERRIDING SYSTEM VALUE` 子句，否则不允许手动插入或更新此列。
- `GENERATED BY DEFAULT AS IDENTITY` ：数据库默认生成一个值，但也可以插入或更新手动值。如果提供了手动值，则将使用该手动值，而不是系统生成的值。

Drizzle-ORM 提供了相应的函数，更多详情请参考 [Identity Columns](https://orm.drizzle.team/docs/column-types/pg#identity-columns)。

- `generatedAlwaysAsIdentity()` 表示 `GENERATED ALWAYS AS IDENTITY`。
- `generatedByDefaultAsIdentity()` 表示 `GENERATED BY DEFAULT AS IDENTITY`。

### 默认值与自动更新

Drizzle-ORM 使用 `default()` 为列提供默认值。

```ts
import { sql } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
const table = pgTable('table', {
	integer1: integer().default(42),
	integer2: integer().default(sql`'42'::integer`),
	uuid1: uuid().defaultRandom(),
	uuid2: uuid().default(sql`gen_random_uuid()`),
});
```

```sql
CREATE TABLE IF NOT EXISTS "table" (
	"integer1" integer DEFAULT 42,
	"integer2" integer DEFAULT '42'::integer,
	"uuid1" uuid DEFAULT gen_random_uuid(),
	"uuid2" uuid DEFAULT gen_random_uuid()
);
```

此外，Drizzle-ORM 提供了 `$default()` 或 `$defaultFn()`（它们是同一函数的不同别名），您可以在运行时生成默认值并在插入中使用这些值。

```ts
import { text, pgTable } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
const table = pgTable('table', {
	id: text().$defaultFn(() => createId()),
});
```

如果您想要在更新时，自动生成值，就像我们更新任务的 `updatedAt` 一样，可以使用 `$update()` 或 `$updateFn()`（它们是同一函数的不同别名）

```ts
updatedAt: timestamp({ mode: "date", precision: 3, withTimezone: false })
  .notNull()
  .default(sql`(now() at time zone 'utc')`)
  .$onUpdate(() => new Date()),
```

如果未提供默认值（或 `$default`），则在插入行时也会调用该函数，并将返回值用作列值。

关于默认值和自动更新的更多详情，请参考 [Default value](https://orm.drizzle.team/docs/column-types/pg#default-value)。

### 列约束

对于数据库的列约束 `NOT NULL`、`UNIQUE`、`PRIMARY KEY`、`CHECK`、`INDEX`，Drizzle-ORM 也提供了对应的函数，比如 `notNull()`、`unique()` 、`primaryKey()`、`check()`、`index()` 等，更多约束函数及使用方式请参考 [Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints)。

#### 多列约束

`notNull()`、`default()`，只在单列中使用，而 `unique()` 、`primaryKey()` 可以用于多列。比如多列一起作为主键，可以使用 `pgTable` 提供的回调函数。

```ts
// primaryKey
export const booksToAuthors = pgTable("books_to_authors", {
  authorId: integer("author_id"),
  bookId: integer("book_id"),
}, (t) => [
  primaryKey({ columns: [t.bookId, t.authorId] }),
  // 自定义名称
  primaryKey({ name: 'custom_name', columns: [t.bookId, t.authorId] }),
]);

// unique
export const composite = pgTable('composite_example', {
  id: integer('id'),
  name: text('name'),
}, (t) => [
  unique().on(t.id, t.name),
  // 自定义名称
  unique('custom_name').on(t.id, t.name)
]);

// check
export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey(),
    username: text().notNull(),
    age: integer(),
  },
  (table) => [
    check("age_check1", sql`${table.age} > 21`),
  ]
);

// index or uniqueIndex
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
}, (table) => [
  index("name_idx").on(table.name),
  uniqueIndex("email_idx").on(table.email)
]);
```

### 外键

Drizzle-ORM 使用 `references()` 或者 `foreignKey()` 定义外键，比如上面 `tasks` 表有一个指向 `users` 表的外键  `userId`，删除方式是 `cascade` （级联删除）。关于外键的更多详情，请参考 [Foreign key](https://orm.drizzle.team/docs/indexes-constraints#foreign-key)。

```ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

// 或者
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
}, (t) => [
  foreignKey({
    columns: [t.userId],
    foreignColumns: [user.id],
    name: "custom_fk"
  })
]);
```

如果你想做一个自我引用，由于 TypeScript 的限制，你必须要么显式地设置返回类型，要么使用一个独立的 `foreignKey()` 函数。

```ts
import { serial, text, integer, foreignKey, pgTable, AnyPgColumn } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  parentId: integer("parent_id").references((): AnyPgColumn => user.id)
});

// foreignKey
export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  parentId: integer("parent_id"),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "custom_fk"
  })
]);
```

#### 外键操作

您可以指定在修改父表中的引用数据时应该发生的操作。这些操作被称为“外键操作”。PostgreSQL为这些操作提供了几个选项。

- `CASCADE` ：当父表中删除一行时，子表中所有对应的行也将被删除。这确保了子表中不存在孤立的行。
- `NO ACTION` ：这是默认操作。如果子表中存在相关行，则阻止删除父表中的行。父表中的 `DELETE` 操作将失败。
- `RESTRICT` ：与 `NO ACTION` 类似，如果子表中存在从属行，则阻止删除父行。它本质上与 `NO ACTION` 相同，出于兼容性原因而存在。
- `SET DEFAULT` ：如果父表中的某一行被删除，子表中的外键列（如果有）将被设置为其默认值。如果没有默认值，则 `DELETE` 操作将失败。
- `SET NULL` ：当父表中删除一行时，子表中的外键列将被设置为 `NULL`。此操作假定子表中的外键列允许 `NULL` 值。

>  与 `ON DELETE` 类似，`ON UPDATE` 也会在引用列发生更改时调用。可能的操作相同，但 `SET NULL` 和 `SET DEFAULT` 不能指定列列表。在这种情况下，`CASCADE` 表示应将被引用列的更新值复制到引用行中。

Drizzle-ORM 的外键操作定义

```ts
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
```

使用方式如下：

```ts
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

// 或者
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
}, (t) => [
  foreignKey({
    columns: [t.userId],
    foreignColumns: [user.id],
    name: "custom_fk"
  })
  .onDelete('cascade')
	.onUpdate('cascade')
]);
```

关于外键操作的更多详情，请参考 [Foreign key actions](https://orm.drizzle.team/docs/relations#foreign-key-actions)

### 关系（relations）

Drizzle-ORM 提出了一个关系的概念，能够以最简单和一致的方式查询关系数据，主要用于 [Drizzle Queries](#drizzle-queries)。

#### 一对一

下面的 `users` 和 `profile_info` 表是一对一关系

```ts
import { pgTable, serial, text, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
});

export const usersRelations = relations(users, ({ one }) => ({
	profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable('profile_info', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	metadata: jsonb('metadata'),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
	user: one(users, { fields: [profileInfo.userId], references: [users.id] }),
}));
```

自我引用， `users` 表引用自己

```ts
import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
	invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
	invitee: one(users, {
		fields: [users.invitedBy],
		references: [users.id],
	}),
}));

```

#### 一对多

下面的 `users` 和 `posts` 表是一对一关系

```ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	content: text('content'),
	authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
}));

```

#### 多对多

多对多的关系稍微复杂一点，需要添加中间层。比如下面的 `users` 和 `groups` 表是多对多关系，需要添加 `users_to_groups` 中间层。

```ts
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => [
		primaryKey({ columns: [t.userId, t.groupId] })
	],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));

```

#### 消除歧义

如果两个表之间有多个关系怎么办？可以使用 `relationName` 选项消除歧义。例如下面 `users` 和 `posts` 存在两种关系 `author` 和 `reviewer`。

```ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
 
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
});
 
export const usersRelations = relations(users, ({ many }) => ({
	author: many(posts, { relationName: 'author' }),
	reviewer: many(posts, { relationName: 'reviewer' }),
}));
 
export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	content: text('content'),
	authorId: integer('author_id'),
	reviewerId: integer('reviewer_id'),
});
 
export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
		relationName: 'author',
	}),
	reviewer: one(users, {
		fields: [posts.reviewerId],
		references: [users.id],
		relationName: 'reviewer',
	}),
}));

```

#### 与外键的区别

您可能已经注意到， `relations` 看起来与外键类似—它们甚至有一个 `references` 属性。那么，它们之间有什么区别呢？

- 外键是数据库级别的约束，每次 `insert` / `update` / `delete` 操作都会检查外键，如果违反约束则会抛出错误。

- 而 `relations` 是更高级别的抽象，它们仅用于在应用程序级别定义表之间的关系。它们不会以任何方式影响数据库模式，也不会隐式创建外键。

这意味着 `relations` 和外键可以一起使用，但它们并不相互依赖。

## 插入数据

Drizzle-ORM 使用 `insert().values()` 插入数据，比如我插入一个用户

```ts
export async function dbInsertUser(
	username: string, 
  email: string, 
  password: string
): Promise<DBUser> {
  try {
    const user: DBInsertUser = {
      username,
      email,
      password,
    };
    const result = await db.insert(users).values(user).returning();
    return result[0];
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}
```

前面说过 Drizzle-ORM 是一个专为现代 TypeScript 项目设计的轻量级 ORM，它具备静态类型推导功能。

```ts
const result = db.insert(users).values(user).returning()
```

`result` 是类型推导结果是：

```ts
const result: {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}[]
```

同时 Drizzle-ORM 也提供了 `.$inferSelect`, `.$inferInsert`  属性，方便我们定义类型。

```ts
export type DBUser = typeof users.$inferSelect;
export type DBInsertUser = typeof users.$inferInsert;
```

## 更新数据

Drizzle-ORM 使用 `update().set().where()` 更新数据，比如我插入一个任务

```ts
export async function dbUpdateTask(taskId: number, updates: { title?: string; completed?: boolean }): Promise<DBTask> {
  const dbUpdates = {
    ...updates,
    updatedAt: new Date(),
  };
  try {
    const result = await db.update(tasks)
    	.set(dbUpdates)
    	.where(eq(tasks.id, taskId))
    	.returning();
    return result[0];
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}
```

也可以不更新 `updatedAt`，因为我们创建表时，使用了 `.$onUpdate(() => new Date())`。如果更新时没有提供列值，则调用该函数，将返回值作为列值。如果列没有提供默认值（`default` 或者 `$default()`），则在插入行时也将调用该函数，并将返回值用作列值。

## 删除数据

Drizzle-ORM 使用 `delete().where()` 删除数据，比如我删除一个任务

```ts
export async function dbDeleteTask(taskId: number): Promise<number> {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return taskId;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
```

## 查询数据

Drizzle-ORM 提供了两套查询数据的 API

- SQL Select
- Drizzle Queries

### SQL Select

和前面提到的插入数据、更新数据、删除数据一样使用 SQL 语句：`select().from().where()`。比如搜索当前用户创建的任务列表

```ts
export async function dbGetTasks(userId: number, title?: string): Promise<DBTask[]> {
  try {
    const filters = [eq(tasks.userId, userId)];
    if (title) {
      filters.push(ilike(tasks.title, `%${title}%`));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(and(...filters))
      .orderBy(
        desc(tasks.completed),
        // CASE WHEN completed THEN updated_at END DESC
        sql`CASE WHEN ${tasks.completed} THEN ${tasks.updatedAt} END DESC`,
        // CASE WHEN NOT completed THEN created_at END ASC
        sql`CASE WHEN NOT ${tasks.completed} THEN ${tasks.createdAt} END ASC`,
      );
    return result;
  } catch (error) {
    console.error("Error fetching tasks by user ID:", error);
    throw error;
  }
}
```

#### 过滤

Drizzle-ORM 通过 `where()` 函数过滤数据，同时提供了 `eq()`、`gt()`、`like()` 等多个过滤函数，以及 `not()`、`and()`、`or()` 多个组合函数。更多详情请参考 [Filter and conditional operators](https://orm.drizzle.team/docs/operators)。

比如获取已经完成的任务

```ts
const result = await db
  .select()
  .from(tasks)
  .where(eq(tasks.completed, true));
```

#### 排序

Drizzle-ORM 通过 `orderBy()` 函数对数据进行排序。

- `asc()`：升序排列
- `desc()`：降序排列

比如按创建时间降序排列

```ts
const result = await db
  .select()
  .from(tasks)
  .where(eq(tasks.completed, true));
	.orderBy(desc(tasks.createdAt));
```

对于一些复杂的 SQL 语句可以使用 `sql` 模板，比如上面例子

```ts
// CASE WHEN completed THEN updated_at END DESC
sql`CASE WHEN ${tasks.completed} THEN ${tasks.updatedAt} END DESC`,
        
// CASE WHEN NOT completed THEN created_at END ASC
sql`CASE WHEN NOT ${tasks.completed} THEN ${tasks.createdAt} END ASC`
```

#### 分页

Drizzle-ORM 可以使用 `limit()` 和 `offset()` 函数对数据进行分页

```js
const result = await db
  .select()
  .from(tasks)
  .where(and(...filters))
  .orderBy(desc(tasks.createAt)
	.limit(10)
	.offset(10);
```

如果想要以 `page`、`pageSize` 进行分页，可以自己进行封装

```ts
const result = await db
  .select()
  .from(tasks)
  .where(and(...filters))
  .orderBy(desc(tasks.createAt))
  .limit(pageSize) 
  .offset((page - 1) * pageSize);
}
```

我们甚至可以封装分页逻辑，使用 [`$dynamic()`](https://orm.drizzle.team/docs/dynamic-query-building) 函数

```ts
import { SQL, asc } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 10,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
const query = db.select().from(tasks);
await withPagination(query.$dynamic(), desc(tasks.createAt));
```

使用 `limit()` 和 `offset()` 函数进行分页

- 优点：它容易实现，而且可以快速导航到至任意页。
- 缺点：随着偏移量的增加，查询性能会下降，因为数据库必须扫描偏移量之前的所有行。并且由于数据移动会导致数据不一致，比如不同的 `page` 上返回相同的行或者某些行被遗漏。

```ts
// 获取第1页的3条数据
await getTasks(1, 3);
// 删除第1页的第2条数据
await db.delete(tasks).where(eq(tasks.id, 2));
// 获取第2页的3条数据，这个时候第4条数据被忽略。
await getTasks(2, 3);
```

为了解决 `limit()` 和 `offset()` 函数进行分页的缺点，Drizzle-ORM 提出了一个基于光标（ Cursor-based）的分页。其实就是使用 `where()` 函数进行过滤。

```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined) // if cursor is provided, get rows after it
    .limit(pageSize) // the number of rows to return
    .orderBy(asc(users.id)); // ordering
};
```

### Drizzle Queries

Drizzle Queries 是对 SQL 的封装，提供了高层次的 API，以最方便、最高效的方式从数据库中获取关系、嵌套数据，而不必担心连接或数据映射。

#### 连接数据库

使用 Drizzle Queries 时，需要指定 `schema` 属性

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
  schema,
});
```

如果是多个 `schema` 文件

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema1 from './schema1';
import * as schema2 from './schema2';

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
  schema: { ...schema1, ...schema2 }
});
```

#### 查询数据

Drizzle Queries 使用 `db.query.tasks.findMany/findFirst` 查询数据。比如获取当前用户创建的所有任务：

```ts
export async function dbGetTasks(userId: number, title?: string): Promise<DBTask[]> {
  try {
    const filters = [eq(tasks.userId, userId)];
    if (title) {
      filters.push(ilike(tasks.title, `%${title}%`));
    }

    const result = await db.query.tasks.findMany({
      where: and(...filters),
      orderBy: [
        desc(tasks.completed),
        // CASE WHEN completed THEN updated_at END DESC
        sql`CASE WHEN ${tasks.completed} THEN ${tasks.updatedAt} END DESC`,
        // CASE WHEN NOT completed THEN created_at END ASC
        sql`CASE WHEN NOT ${tasks.completed} THEN ${tasks.createdAt} END ASC`,
      ],
      limit: 10,
      offset: 0,
    });

    return result;
  } catch (error) {
    console.error("Error fetching tasks by user ID:", error);
    throw error;
  }
}
```

对比 SQL Select 查询数据，Drizzle Queries 使用 `where`、`orderBy`、`limit/offset` 属性进行过滤、排序、分页操作。

#### 查询嵌套数据

Drizzle Queries 最大的用途是查询嵌套数据，比如我要查询所有用户，以及用户创建的所有任务

首先我们要创建数据库表之间的关联关系

```ts
import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  // 和上面一样，省略
});

export const tasks = pgTable("tasks", {
  // 和上面一样，省略
});

// 创建 users 和 tasks 表之间的关联关系
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));
```

查询所有用户，以及用户创建的所有任务

```ts
const result = await db.query.users.findMany({
  with: {
    tasks: true,
  },
});
```

获取的数据

```
[
	{
    "id": 1,
    "username": "cp3hnu",
    "email": "xxx@gmail.com",
    "password": "$2b$10$3quzlpLVjZaWyYFSIiuXheUfvlg9oAr4NVUT5gvAHwon4FDHrwQt6",
    "createdAt": "2025-06-26T02:07:59.050Z",
    "updatedAt": "2025-06-26T02:07:59.050Z",
    "tasks": [
      {
        "id": 1,
        "userId": 1,
        "title": "Vue",
        "description": null,
        "completed": true,
        "createdAt": "2025-06-26T02:08:16.121Z",
        "updatedAt": "2025-06-26T02:08:46.735Z"
      },
      {
        "id": 2,
        "userId": 1,
        "title": "React",
        "description": null,
        "completed": false,
        "createdAt": "2025-06-26T02:59:46.641Z",
        "updatedAt": "2025-06-26T02:59:46.641Z"
      },
      {
        "id": 3,
        "userId": 1,
        "title": "Grid 布局",
        "description": null,
        "completed": false,
        "createdAt": "2025-06-26T06:16:44.798Z",
        "updatedAt": "2025-06-26T06:16:44.798Z"
      }
    ]
	},
	{
    "id": 2,
    "username": "zhaowei",
    "email": "xxx@163.com",
    "password": "$2b$10$Y7.f4tK/4yue/dwfTNMshODLSc.l6Qk8vZqrIeQrxr0nksHjq8FE2",
    "createdAt": "2025-06-26T03:01:40.224Z",
    "updatedAt": "2025-06-26T03:01:40.224Z",
    "tasks": [
      {
        "id": 4,
        "userId": 2,
        "title": "Drizzle-ORM",
        "description": null,
        "completed": false,
        "createdAt": "2025-08-13T02:11:54.292Z",
        "updatedAt": "2025-08-13T02:11:54.292Z"
      }
    ]
	}
]
```

如果使用 SQL 语句

```sql
SELECT
  u.*,
  COALESCE(
    json_agg(t) FILTER (WHERE t.id IS NOT NULL),
    '[]'
  ) AS tasks
FROM
  users u
LEFT JOIN
  tasks t
ON
  u.id = t.user_id
GROUP BY
  u.id;
```

Drizzle Queries 简化了多表的连接查询。

## Drizzle Studio

[Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) 提供了在 Drizzle-ORM 项目中探索 SQL 数据库的一种新方式。

```sh
$ npx drizzle-kit studio
```

![](./assets/drizzle-studio.png)

## 其它

##### 如果数据库工具（比如 TablePlus）中文乱码，该怎么处理？

设置 `encoding` 为 UTF8

```sql
SET client_encoding = 'UTF8';
```

## Source Code

[`cp3hnu/nextjs-todo`](https://github.com/cp3hnu/nextjs-todo/)

## 应用地址

https://nextjs-todo-liard-one.vercel.app/

## References

- [Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview)
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)
- [PostgreSQL 17.5 Documentation](https://www.postgresql.org/docs/current/index.html)
- [`postgres.js`](https://github.com/porsager/postgres)
- [`node-postgres`](https://github.com/brianc/node-postgres) 
- [`tsx`](https://github.com/privatenumber/tsx)
