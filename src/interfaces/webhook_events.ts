export declare type EventType =
  | "BILLING.SUBSCRIPTION.ACTIVATED"
  | "PAYMENT.SALE.COMPLETED"
  | "PAYMENT.SALE.REVERSED"
  | "BILLING.SUBSCRIPTION.SUSPENDED"
  | "BILLING.SUBSCRIPTION.CANCELLED"
  | "BILLING.SUBSCRIPTION.UPDATED"
  | "PAYMENT.SALE.REFUNDED";
export declare type Status =
  | "ACTIVE"
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED";
export declare interface ISubscription {
  id: string;
  status: Status;
  status_update_time: "2020-02-01T01:00:00Z";
  plan_id: "P-5ML4271244454362WXNWU5NQ";
  start_time: "2020-02-01T01:00:00Z";
  shipping_amount: {
    currency_code: "USD";
    value: "3.00";
  };
  subscriber: {
    name: {
      given_name: "John";
      surname: "Doe";
    };
    email_address: "john@example.com";
    shipping_address: {
      name: {
        full_name: "John Doe";
      };
      address: {
        address_line_1: "2211 N First Street";
        address_line_2: "Building 17";
        admin_area_2: "San Jose";
        admin_area_1: "CA";
        postal_code: "95131";
        country_code: "US";
      };
    };
  };
  billing_info: {
    outstanding_balance: {
      currency_code: "USD";
      value: "10.00";
    };
    cycle_executions: [
      {
        tenure_type: "TRIAL";
        sequence: 1;
        cycles_completed: 1;
        cycles_remaining: 0;
        total_cycles: 1;
        current_pricing_scheme_version: 1;
      },
      {
        tenure_type: "REGULAR";
        sequence: 2;
        cycles_completed: 1;
        cycles_remaining: 0;
        total_cycles: 0;
        current_pricing_scheme_version: 2;
      }
    ];
    last_payment: {
      amount: {
        currency_code: "USD";
        value: "500.00";
      };
      time: "2018-12-01T01:20:49Z";
    };
    next_billing_time: "2020-01-01T00:20:49Z";
    final_payment_time: "2020-01-01T00:20:49Z";
    failed_payments_count: 2;
  };
  create_time: "2018-12-10T21:20:49Z";
  update_time: "2018-12-10T21:20:49Z";
  links: [
    {
      href: "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G";
      rel: "self";
      method: "GET";
    },
    {
      href: "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G";
      rel: "edit";
      method: "PATCH";
    },
    {
      href: "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/cancel";
      rel: "cancel";
      method: "POST";
    },
    {
      href: "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/activate";
      rel: "activate";
      method: "POST";
    },
    {
      href: "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/capture";
      rel: "capture";
      method: "POST";
    }
  ];
}

export declare interface IResponseSubscription {
  billingCycle: string;
  price: string;
  status: string;
  nextBillingDate: string;
  id: string;
  planId: string;
}
export declare interface IWebhookBody {
  id: string;
  create_time: "2018-19-12T22:20:32.000Z";
  resource_type: "subscription";
  event_type: EventType;
  summary: "A billing agreement was activated.";
  resource: {
    quantity: "1";
    subscriber: {
      payer_id: string;
      email_address: string;
    };
    create_time: "2018-12-10T21:20:49Z";
    shipping_amount: {
      currency_code: "USD";
      value: "10.00";
    };
    start_time: "2018-11-01T00:00:00Z";
    update_time: "2018-12-10T21:20:49Z";
    billing_info: {
      outstanding_balance: {
        currency_code: "USD";
        value: "10.00";
      };
      cycle_executions: [
        {
          tenure_type: "TRIAL";
          sequence: 1;
          cycles_completed: 1;
          cycles_remaining: 0;
          current_pricing_scheme_version: 1;
        },
        {
          tenure_type: "REGULAR";
          sequence: 2;
          cycles_completed: 1;
          cycles_remaining: 0;
          current_pricing_scheme_version: 2;
        }
      ];
      last_payment: {
        amount: {
          currency_code: "USD";
          value: "500.00";
        };
        time: "2018-12-01T01:20:49Z";
      };
      next_billing_time: "2019-01-01T00:20:49Z";
      final_payment_time: "2020-01-01T00:20:49Z";
      failed_payments_count: 2;
    };
    links: [
      {
        href: "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G";
        rel: "self";
        method: "GET";
      },
      {
        href: "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G";
        rel: "edit";
        method: "PATCH";
      },
      {
        href: "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/suspend";
        rel: "suspend";
        method: "POST";
      },
      {
        href: "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/cancel";
        rel: "cancel";
        method: "POST";
      },
      {
        href: "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/capture";
        rel: "capture";
        method: "POST";
      }
    ];
    id: "I-BW452GLLEP1G";
    plan_id: "P-5ML4271244454362WXNWU5NQ";
    auto_renewal: true;
    status: "ACTIVE";
    status_update_time: "2018-12-10T21:20:49Z";
  };
  links: [
    {
      href: "https://api.paypal.com/v1/notifications/webhooks-events/WH-77687562XN25889J8-8Y6T55435R66168T6";
      rel: "self";
      method: "GET";
      encType: "application/json";
    },
    {
      href: "https://api.paypal.com/v1/notifications/webhooks-events/WH-77687562XN25889J8-8Y6T55435R66168T6/resend";
      rel: "resend";
      method: "POST";
      encType: "application/json";
    }
  ];
  event_version: "1.0";
  resource_version: "2.0";
}
export declare interface IPlan {
  id: "P-5ML4271244454362WXNWU5NQ";
  product_id: "PROD-XXCD1234QWER65782";
  name: "Basic Plan";
  description: "Basic Plan";
  status: "ACTIVE";
  billing_cycles: [
    {
      frequency: {
        interval_unit: "MONTH";
        interval_count: 1;
      };
      tenure_type: "TRIAL";
      sequence: 1;
      total_cycles: 2;
      pricing_scheme: {
        fixed_price: {
          currency_code: "USD";
          value: "3";
        };
        version: 1;
        create_time: "2020-05-27T12:13:51Z";
        update_time: "2020-05-27T12:13:51Z";
      };
    },
    {
      frequency: {
        interval_unit: "MONTH";
        interval_count: 1;
      };
      tenure_type: "TRIAL";
      sequence: 2;
      total_cycles: 3;
      pricing_scheme: {
        fixed_price: {
          currency_code: "USD";
          value: "6";
        };
        version: 1;
        create_time: "2020-05-27T12:13:51Z";
        update_time: "2020-05-27T12:13:51Z";
      };
    },
    {
      frequency: {
        interval_unit: "MONTH";
        interval_count: 1;
      };
      tenure_type: "REGULAR";
      sequence: 3;
      total_cycles: 12;
      pricing_scheme: {
        fixed_price: {
          value: "10";
          currency_code: "USD";
        };
        status: "ACTIVE";
        version: 1;
        create_time: "2020-05-27T12:13:51Z";
        update_time: "2020-05-27T12:13:51Z";
      };
    }
  ];
  taxes: {
    percentage: "10";
    inclusive: false;
  };
  create_time: "2020-05-27T12:13:51Z";
  update_time: "2020-05-27T12:13:51Z";
  links: [
    {
      href: "https://api-m.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ";
      rel: "self";
      method: "GET";
    },
    {
      href: "https://api-m.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ";
      rel: "edit";
      method: "PATCH";
    },
    {
      href: "https://api-m.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ/deactivate";
      rel: "deactivate";
      method: "POST";
    },
    {
      href: "https://api-m.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ/update-pricing-schemes";
      rel: "edit";
      method: "POST";
    }
  ];
}
