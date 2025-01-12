import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a register request', async () => {
    const user = {
      name: 'Moist Von Lipvig',
      email: 'moist-lipvig1@sophon.com',
      password: 't35tp455F0rM3',
    };

    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: user.name,
        email: user.email,
        password: user.password,
      })
      .expect(201)
      .then((response) => {
        const { username, id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  it('register as a new user then get the currently logged in user', async () => {
    const user = {
      name: 'Adorabelle Dearheart',
      email: 'adorabelle-dearheart@golem-trust.com',
      password: 'g0L3mTru5tAD',
    };

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({ username: user.name, email: user.email, password: user.password })
      .expect(201);

    const coookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', coookie)
      .expect(200);

    expect(body.email).toEqual(user.email);
  });
});
