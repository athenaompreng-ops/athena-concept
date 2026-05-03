import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('ATHENA API')
    .setDescription(
      `
## Advanced Threat Handling & Encryption Network Application

ATHENA API — Backend service untuk platform perlindungan visual berbasis AI.

### Fitur Utama
- **4A Shield Processing** — Anti-AI, Anti-NSFW, Anti-Deepfake, Anti-Training
- **Credit System** — Pembelian dan manajemen kredit pemrosesan
- **Shield Verification** — Verifikasi publik Shield Hash
- **ATHENA Score** — Dashboard dampak kolektif komunitas

### Autentikasi
Gunakan Bearer token (JWT) dari Supabase Auth untuk endpoint yang membutuhkan autentikasi.
    `.trim(),
    )
    .setVersion('0.1.0')
    .setContact(
      'ATHENA Team',
      'https://github.com/athena-platform',
      'team@athena.id',
    )
    .setLicense('Proprietary', 'https://github.com/athena-platform/LICENSE')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan JWT token dari Supabase Auth',
      },
      'access-token',
    )
    .addTag('Health', 'System health checks')
    .addTag('Auth', 'Autentikasi & manajemen user')
    .addTag('Shield', 'Core 4A Shield processing')
    .addTag('Credits', 'Manajemen kredit pemrosesan')
    .addTag('Score', 'ATHENA Score — dashboard dampak kolektif')
    .addServer('http://localhost:3000', 'Local Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'ATHENA API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { background-color: #1B2838; }
      .swagger-ui .topbar .download-url-wrapper .select-label select { border-color: #C9A84C; }
      .swagger-ui .info .title { color: #1B2838; }
      .swagger-ui .scheme-container { background-color: #f8f9fa; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🏛️  ATHENA API is running on: http://localhost:${port}`);
  console.log(`📚  Swagger UI available at: http://localhost:${port}/docs`);
  console.log(
    `📄  OpenAPI JSON at: http://localhost:${port}/docs-json\n`,
  );
}
bootstrap();
