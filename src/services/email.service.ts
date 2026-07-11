import { Resend } from 'resend';

import config from '../config/environment.js';

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.RESEND_API_KEY);
  }

  async sendWorkspaceInvite(email: string, token: string, userExists: boolean) {
    const inviteUrl = userExists
      ? `${config.FRONTEND_URL}/invite/${token}`
      : `${config.FRONTEND_URL}/signup?invite=${token}`;

    const subject = userExists
      ? 'Workspace Invitation'
      : 'Complete your signup';

    const html = `
      <h2>Workspace Invitation</h2>

      <p>You have been invited to join a workspace.</p>

      <p>
        <a href="${inviteUrl}">
          Click here to continue
        </a>
      </p>

      <p>This invitation will expire in 7 days.</p>
    `;

    const result = await this.resend.emails.send({
      from: config.FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    console.log('Resend Result:', result);
  }
}

export default EmailService;
