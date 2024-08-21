import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1>This is an example of creating a backend application using the following set of technologies:</h1> 
      <ul>
        <li>Nest,</li> 
        <li>Typescript,</li>
        <li>Postgresql,</li>
        <li>Typeorm (versions above ^0.3.20)</li>
        <li>Creating Migrations, configuring usage and automatic execution</li>
        <li>Docker(API) - deploying applications in Docker</li> 
        <li>Docker(DB) - deploying DB in Docker</li> 
      </ul>
    `;
  }
}
