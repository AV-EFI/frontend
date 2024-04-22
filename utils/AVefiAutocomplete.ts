import { createInput } from '@formkit/vue';
const searchParamsStore = useSearchParamsStore();

/**
 * This is an input "feature"- a function that accepts a node and exposes
 * some additional functionality to an input. When using schemas, this can
 * take the place of a traditional "script" block in a Vue component. In this
 * example, we expose:
 *
 *   - An input handler `search`.
 *   - An input handler `selections`.
 *   - Commit middleware to place filtered options into the `matches` prop.
 *
 * Once written, input features are added via the input declaration.
 */
const searchFeature = (node: FormKitNode) => {
    // We wait for our node to be fully  "created" before we start to add our
    // handlers to ensure the core Vue plugin has added its context object:
    node.on('created', async () => {
        // Ensure our matches prop starts as an array.
        node.props.matches = [] as typeof Option[];
        node.props.options = await searchParamsStore.searchMovies({});

        // When we actually have an value to set:
        const setValue = async (e: Event) => {
            if (e && typeof e.preventDefault === 'function') {
                //e.preventDefault();
            }

            await new Promise((r) => setTimeout(r, 50)); // "next tick"
            if (document != null && document.querySelector('input#' + node.props.id)) {
                (document.querySelector('input#' + node.props.id) as HTMLElement).focus();
            }

        };

        // Perform a soft selection, this is shown as a highlight in the dropdown
        const select = (delta: any) => {
            const available = node.props.matches;
            let idx = available.indexOf(node.props.selection) + delta;
            if (idx >= available.length) {
                idx = 0;
            } else if (idx < 0) {
                idx = available.length - 1;
            }
            node.props.selection = available[idx];
        };

        // Add some new "handlers" for our autocomplete. The handlers object is
        // just a conventionally good place to put event handlers. Auto complete
        // inputs always have to deal with lots of keyboard events, so that logic
        // is registered here.
        if (node.context) {
            Object.assign(node.context.handlers, {
                setValue,
                selection: (e: any) => {
                    // This handler is called when entering data into the search input.
                    switch (e.key) {
                        case 'Enter':
                            return setValue(e);
                        case 'ArrowDown':
                            e.preventDefault();
                            return select(1);
                        case 'ArrowUp':
                            e.preventDefault();
                            return select(-1);
                    }
                    return null;
                },
                submitAndRedirect(e: any) {
                    e.preventDefault();
                    //node.input(node.props.searchTerm);
                    navigateTo("/search");
                },
                search(e: any) {
                    node.props.searchTerm = e.target.value;
                },
                hover: (e: any) => {
                    node.props.selection = e.target.textContent;
                },
                unhover: (e: any) => {
                    if (e.target.textContent === node.props.selection) {
                        node.props.selection = '';
                    }
                },
            });
        }

    });

    // Perform filtering when the search value changes
    node.on('prop:searchTerm', ({ payload: value }: any) => {
        if (value) {
            node.input(value);
        }
        try {
            const results = node.props.options.filter((option: any) =>
                option.label.toLowerCase().includes(value.toLowerCase().trim())
            );
            if (!results.length) results.push(new Option('No matches', ''));
            node.props.matches = results.map((option) => option);
        }
        catch (e) {
            console.error(e);
            node.props.matches = new Option("No matches");
        }
    });
};

/**
 * This is our input schema responsible for rendering the inner “input”
 * section. In our example, we render an text input which will be used
 * to filter search results, and an unordered list that shows all remaining
 * matches.
 */
const schema = [
    {
        $el: 'input',
        bind: '$attrs',
        name: 'searchTerm',
        id: 'searchTerm',
        attrs: {
            //id: '$id',
            class: 'w-full appearance-none dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:text-zinc-400 group-data-[disabled]:!cursor-not-allowed dark:placeholder-zinc-400/50 dark:text-zinc-300 border-none p-0 focus:ring-0 formkit-input',
            onKeydown: '$handlers.selection',
            onInput: '$handlers.search',
            value: '$_value',
        },
    },
    {
        $el: "button",
        attrs: {
            title: "Search",
            class: "btn btn-primary m-0 rounded-lg",
            onClick: "$handlers.submitAndRedirect"
        },
        label: "Suchen",
        children: [
            "Suchen"
        ]
    },
    {
        $el: 'ul',
        if: '$matches.length < $options.length',
        attrs: {
            class: '$classes.dropdown',
        },
        children: [
            {
                $el: 'li',
                for: ['match', '$matches'],
                attrs: {
                    'data-selected': {
                        if: '$selection === $match',
                        then: 'true',
                        else: 'false',
                    },
                    class: '$classes.dropdownItem',
                    onClick: '$handlers.setValue',
                    onMouseenter: '$handlers.hover',
                    onMouseleave: '$handlers.unhover',
                },
                children: [
                    {
                        if: '$match.value',
                        then: {
                            $el: 'a',
                            attrs: {
                                href: '$: "/films/works/" + $match.value'
                            },
                            children: {
                                if: '$match.value',
                                then: '$: $match.label + " → "',
                                else: '$match.label'
                            }
                        },
                        else: {
                            $el: 'span',
                            children: [
                                '$: $match.label',
                            ]
                        }
                    }
                ]
            }
        ]
    }
];

/**
 * Finally we create our actual input declaration by using `createInput` this
 * places our schema into a "standard" FormKit schema feature set with slots,
 * labels, help, messages etc. The return value of this function is a proper
 * input declaration.
 */
const autocomplete = createInput(schema, {
    props: ['options', 'matches', 'selection', 'searchTerm'],
    features: [searchFeature],
    family: 'text', // choose which family to inherit base class lists from
});

export default autocomplete;
