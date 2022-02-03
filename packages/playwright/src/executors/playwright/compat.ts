import { convertNxExecutor } from '@nrwl/devkit';

import { default as cypressExecutor } from './playwright.impl';

export default convertNxExecutor(cypressExecutor);
