# Prisma Article Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补全 Prisma 博客文章的模型关系、CRUD、查询、迁移和 Studio 章节。

**Architecture:** 使用一组贯穿全文的 `User`、`Profile`、`Post`、`Category` 模型讲解
Prisma。先建立字段与关系，再用同一组模型展示嵌套写入和关联查询，最后说明开发与生产
迁移流程。

**Tech Stack:** Markdown、Prisma ORM 7.8、PostgreSQL、TypeScript、Next.js

## Global Constraints

- 保留 `docs/blog/2026-04-27-prisma.md` 中现有未提交修改。
- 使用 `prisma-client` generator 和 `../generated/prisma` 输出路径。
- 关系必须双向声明；模型包含 `createdAt` 和 `updatedAt`。
- 外键及常用查询字段添加索引，唯一业务字段添加唯一约束。
- 不执行数据库迁移，不写入真实凭据。

---

### Task 1: 扩展贯穿全文的 Prisma Schema

**Files:**
- Modify: `docs/blog/2026-04-27-prisma.md:95-124`
- Modify: `docs/blog/2026-04-27-prisma.md:236-240`

**Interfaces:**
- Produces: 后续章节统一使用的 `User`、`Profile`、`Post`、`Category`、`Role`。

- [ ] **Step 1: 更新初始化章节中的完整 Schema**

模型关系必须包含：

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id        Int      @id @default(autoincrement())
  bio       String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int      @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id         Int        @id @default(autoincrement())
  title      String
  content    String?
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId   Int
  categories Category[]
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  @@index([authorId])
  @@index([published, createdAt])
}

model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

- [ ] **Step 2: 编写创建表章节**

依次说明常用标量类型、`@default`/`@updatedAt`、`@id`/`@unique`/`@@index`、枚举，
然后分别解释：

- `User.profile` ↔ `Profile.user`：通过唯一外键实现一对一。
- `User.posts` ↔ `Post.author`：关系标量字段 `authorId` 存储外键。
- `Post.categories` ↔ `Category.posts`：隐式多对多，由 Prisma 管理中间表。
- 关系附加字段时，改用包含两个外键与复合主键的显式中间模型。

- [ ] **Step 3: 检查 Schema 一致性**

确认每个关系两端均存在，`userId` 唯一，`authorId` 有索引，所有模型都有时间字段。

### Task 2: 补写插入、更新与删除数据

**Files:**
- Modify: `docs/blog/2026-04-27-prisma.md:240-246`

**Interfaces:**
- Consumes: Task 1 的模型和 `prisma` Client 实例。
- Produces: 可独立阅读的 CRUD 示例。

- [ ] **Step 1: 编写插入数据章节**

覆盖：

```ts
await prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
    profile: { create: { bio: "TypeScript developer" } },
    posts: {
      create: {
        title: "Hello Prisma",
        categories: {
          connectOrCreate: {
            where: { name: "Prisma" },
            create: { name: "Prisma" },
          },
        },
      },
    },
  },
  include: { profile: true, posts: { include: { categories: true } } },
});
```

另说明 `createManyAndReturn()`、`skipDuplicates` 的使用边界，以及嵌套写入的事务性。

- [ ] **Step 2: 编写更新数据章节**

使用 `update()` 演示按唯一字段更新和 `connect` 关系；使用 `updateMany()` 批量发布文章；
使用 `upsert()` 实现存在则更新、不存在则创建。

- [ ] **Step 3: 编写删除数据章节**

使用 `delete()` 和 `deleteMany()`，解释 Schema 中 `onDelete: Cascade` 的效果；补充
`prisma.$transaction()` 按顺序删除依赖记录的示例，说明无级联规则时需先删子记录。

### Task 3: 补写查询数据

**Files:**
- Modify: `docs/blog/2026-04-27-prisma.md:246-248`

**Interfaces:**
- Consumes: Task 1 的模型。
- Produces: 基础、条件、关系、分页和统计查询示例。

- [ ] **Step 1: 编写基础与字段选择**

分别展示 `findUnique()`、`findFirst()`、`findMany()`，并用 `select` 限制返回字段。

- [ ] **Step 2: 编写过滤、排序与分页**

示例使用 `where`、`contains`、`mode: "insensitive"`、`some` 关系过滤、`orderBy`、
`skip`/`take` 偏移分页和基于 `cursor` 的游标分页；说明大偏移量和数据变动对
偏移分页的影响。

- [ ] **Step 3: 编写关系查询**

使用嵌套 `include` 一次读取用户、Profile、文章和分类；说明同一级不能同时使用
`select` 与 `include`，需要在 `select` 内选择关系字段。

- [ ] **Step 4: 编写聚合与事务**

使用 `count()`、`aggregate()`、`groupBy()`；使用数组形式的 `$transaction()` 同时
取得列表与总数，构成分页响应。

### Task 4: 补写迁移与 Prisma Studio

**Files:**
- Modify: `docs/blog/2026-04-27-prisma.md:248-264`

**Interfaces:**
- Consumes: Task 1 的 Schema。
- Produces: 可用于本地开发和生产部署的命令说明。

- [ ] **Step 1: 编写本地开发迁移**

用给 `Post` 新增 `slug String @unique` 为例，执行：

```sh
npx prisma migrate dev --name add_post_slug --create-only
npx prisma migrate dev
```

说明先检查生成的 SQL，再应用迁移；涉及非空列时先处理已有数据。

- [ ] **Step 2: 编写生产迁移和辅助命令**

覆盖：

```sh
npx prisma migrate deploy
npx prisma migrate status
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
npx prisma db push
```

明确 `migrate dev` 仅用于开发，`migrate deploy` 用于测试/生产，`db push` 不生成
可追踪历史，生产迁移应先在 staging 验证并准备回滚方案。

- [ ] **Step 3: 编写 Prisma Studio**

展示 `npx prisma studio`，说明它读取配置和 Schema，适合本地查看、编辑与验证数据，
不应将未受保护的 Studio 暴露到公网。

- [ ] **Step 4: 更新参考链接**

添加 Prisma Schema、CRUD、Relations、Filtering、Pagination、Aggregation、
Transactions、Migrate 和 Studio 官方文档链接。

### Task 5: 验证文章

**Files:**
- Verify: `docs/blog/2026-04-27-prisma.md`

**Interfaces:**
- Consumes: Tasks 1-4 的完整文章。
- Produces: 格式和内容一致的最终 Markdown。

- [ ] **Step 1: 检查结构**

搜索空标题、未闭合代码围栏、`TODO`/`TBD`，确认七个章节均有正文。

- [ ] **Step 2: 检查 API 和模型一致性**

确认所有示例使用同一组字段、关系和 Client 导入路径，命令符合 Prisma 7.8。

- [ ] **Step 3: 运行项目文档检查**

查看 `package.json` 后运行现有 Markdown、VitePress 或构建脚本；预期命令退出码为 0。

- [ ] **Step 4: 检查最终差异**

运行 `git diff --check` 和 `git diff -- docs/blog/2026-04-27-prisma.md`，确认没有空白错误，
并保留用户开始时已有的两处修改。
