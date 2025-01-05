import { RESPONSE_TIMEOUT } from '@_pw-config';
import { Page, Response } from '@playwright/test';

export async function waitForResponse(
  page: Page,
  url: string,
  method?: string,
  status?: number,
): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      //   console.log(
      //     response.status(),
      //     response.request().method(),
      //     response.url(),
      //   );
      return (
        response.url().includes(url) && // && wszystkie warunki muszą być spelnione
        (!method || response.request().method() == method) && //sprawdzamy czy method jest podany; method is false, !method is true, || is not executed
        (!status || response.status() == status)
      );
    },
    {
      timeout: RESPONSE_TIMEOUT,
    },
  );
}
