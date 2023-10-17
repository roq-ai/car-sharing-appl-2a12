interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Customer Service Representative'],
  customerRoles: ['Customer'],
  tenantRoles: ['Business Owner', 'Team Member', 'Customer Service Representative', 'Driver'],
  tenantName: 'Organization',
  applicationName: 'Car Sharing Application',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'Manage personal information',
    'Create and manage bookings',
    'Create reviews',
    'Create complaints',
  ],
  ownerAbilities: [
    'Manage user information',
    'Manage booking information',
    'Manage review information',
    'Manage complaint information',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/471965f2-bc11-4bc3-b025-72f618201509',
};
