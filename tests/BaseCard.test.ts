
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

import BaseCard from "../src/cards/BaseCard.svelte";
import { getByText, render } from "@testing-library/svelte";


describe("BaseCard Component", () => {


    test("should render card type selector", () => {
        const { container, queryByRole, getByRole, component }  = render(BaseCard, { props: {
            type: "bar"
        }});

        expect(getByRole('combobox', { name: "typeSelector", exact: false})).toBeTruthy();    
    });

    test("n should be shown somewhere on the card", () => {
        const { container, queryByRole, getByRole, component }  = render(BaseCard, { props: {
            n: 135497
        }});
        expect(container).toHaveTextContent("135497")
    });


    test("title should be shown somewhere on the card", () => {
        const { container, queryByRole, getByRole, component }  = render(BaseCard, { props: {
            title: "Some test title"
        }});
        expect(container).toHaveTextContent("Some test title")
    });
});

export {}