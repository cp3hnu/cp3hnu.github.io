# Prisma 文章补写设计

## 目标

补全 `docs/blog/2026-04-27-prisma.md` 中尚为空白的章节，使内容深度与
`docs/blog/2025-07-21-drizzle-orm.md` 基本一致，同时保持现有文章的中文表达和
PostgreSQL 技术栈，并扩展示例模型以覆盖常见关系。

## 范围

- 创建表：介绍 Prisma Schema 的字段类型、枚举、默认值、约束、索引，以及一对一、
  一对多和多对多关系。
- 插入数据：介绍 `create`、嵌套写入、`createManyAndReturn` 及重复数据处理。
- 更新数据：介绍 `update`、`updateMany`、`upsert` 和嵌套更新。
- 删除数据：介绍 `delete`、`deleteMany`、级联删除与事务删除。
- 查询数据：介绍 `findUnique`、`findFirst`、`findMany`、字段选择、关系查询、
  过滤、排序、分页、聚合和事务。
- 数据库迁移：区分 `migrate dev`、`migrate deploy`、`db push`、`migrate status`
  与 `migrate diff`，强调检查 SQL、数据保护和生产环境流程。
- Prisma Studio：介绍启动命令、指定配置与适用边界。

## 内容设计

文章使用 `User`、`Profile`、`Post`、`Category` 和 `Role` 枚举组成完整示例：

- `User` 与 `Profile`：一对一关系，`Profile.userId` 使用唯一约束。
- `User` 与 `Post`：一对多关系，`Post.authorId` 使用外键索引。
- `Post` 与 `Category`：使用 Prisma 隐式多对多关系，必要时再说明显式中间模型的
  适用场景。

所有模型包含符合用途的 `createdAt` 和 `updatedAt` 字段；需要按名称查询的
`Category.name` 使用唯一约束。关系两端均在 Prisma Schema 中声明。后续 CRUD、
关系查询和嵌套写入示例均基于这组模型，避免各章节使用互不相关的数据结构。

查询章节采用“基础查询 → 条件查询 → 关系数据 → 分页与统计”的顺序。迁移章节采用
“本地开发 → 检查 SQL → 生产部署 → 状态与差异排查”的顺序，并明确 `db push`
不生成迁移历史，不应用于需要可追踪迁移的生产流程。

## 编辑约束

- 保留用户当前未提交的“上篇文章”措辞修改和“创建表”标题位置调整。
- 不改变文章现有标题、日期和整体定位。
- 示例以 Prisma 7.8、`prisma-client` generator、PostgreSQL driver adapter 为基准，
  并沿用现有 `../generated/prisma` Client 输出路径。
- 不写入真实数据库凭据，不执行数据库迁移。
- 必要时修正与新增章节直接相关的拼写和一致性问题。

## 验证

- 检查 Markdown 标题层级、代码围栏和内部锚点。
- 检查示例中的模型名、字段名和导入路径前后一致。
- 对照 Prisma 当前官方文档核验 API 与迁移命令；若文档服务不可用，使用官方网页。
- 运行项目现有的文档检查或构建命令（如存在）。
