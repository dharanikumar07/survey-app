import { Banner, extension } from '@shopify/ui-extensions/customer-account';

// Placeholder UI for boilerplate – shows a single banner on the Order status page
export default extension('customer-account.order-status.block.render', (root, api) => {
    root.replaceChildren(
        root.createComponent(Banner, { title: 'The survey from the app will be shown here.' })
    );
});

/*
// Previous implementation kept for reference
import {
    Banner,
    extension,
} from '@shopify/ui-extensions/customer-account';

export default extension(
    'customer-account.order-status.block.render',
    (root, { order }) => {
        let bannerShown = false;

        order.subscribe((order) => {
            if (order && !bannerShown) {
                root.appendChild(
                    root.createComponent(
                        Banner,
                        undefined,
                        `Please include your order ID (${order.id}) in support requests`,
                    ),
                );

                bannerShown = true;
            }
        });
    },
);
*/
