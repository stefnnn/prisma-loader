# prisma-loader

prisma-loader is a utility to load your database with initial data (a.k.a «fixture»). You specify the initial data in a YAML file. Use it to get your database into a predictable state in your CI/CD pipeline or before every test run during testing.

## What is Prisma?

Prisma is an open-source database toolkit, that replaces traditional ORMs and makes database access easy with an auto-generated query builder for TypeScript & Node.js.

👉 [prisma.io/docs/](https://www.prisma.io/docs/)

## How to use this tool

```
yarn add prisma-loader -D
npx prisma-loader path/to/data.yml [more.yml files.yml]
```

Let's suppose we want to load two users into our database. Let's also assume, that our [Prisma Schema](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema) has a type «user» already defined (see example [schema.prisma](/prisma/schema.prisma)).

```yaml
# initial-data.yml
user:
  - name: Admin
    email: admin@somemail.com
    password: test
    role: ADMIN
  - name: Student
    email: student@somemail.com
    password: test
    role: STUDENT
```

This will generate two users in our database. You can define further types and initial data within the same YAML file:

```yaml
# initial-data.yml
user:
  - name: Admin
    ...

school:
  - name: School One
    ...
```

If your database already contains data, e.g. from a previous initialization run, then you may want to first delete this data. You can do this by specifying which types to delete in the YAML file:

```yaml
# initial-data.yml
delete:
  - user
  - school
  - ...

user:
  - name: Admin
    ...

school:
  - name: School One
    ...
```

Watch out, depending on how the data types reference each other you may run into problems when deleting data, as Prisma does not yet support cascading deletes (see [this issue](https://github.com/prisma/prisma/issues/2810)). List those types first, which no other types references to as a required relation.
