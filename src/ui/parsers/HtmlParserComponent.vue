<template></template> <!-- Leave this empty since we are using render function -->

<script lang="ts">
import BaseButton from '@/ui/controls/BaseButton.vue';
import { defineComponent, h, ref, onMounted, createTextVNode, watch } from 'vue';
import { IHtmlParserDataProps, IHtmlParserElementItem } from '../types';
// import { defineAsyncComponent } from 'vue';

export default defineComponent({
  name: 'HtmlParserComponent',

  props: {
    htmlString: {
      type: String,
      required: false,
    },
  },

  emits: ['triggered'], // Define the triggered emit

  setup(props, { emit }) {
    const parsedElementsTest = ref<IHtmlParserElementItem[]>([]);
    // const customComponentDict: { [key: string]: any } = {};
    
    // Custom components mapping
    const customComponentsTest: { [key: string]: any } = {
      'basebutton': {}
    };

    /**
     * Parses an HTML string and converts it into an array of structured elements.
     * Each element is represented as an `IElementItem` with properties such as tag name, children,
     * attributes, and text content, enabling structured traversal and manipulation of the HTML content.
     *
     * @param {string} htmlString - The HTML string to be parsed and transformed.
     * @returns {IElementItem[]} - An array of `IElementItem` objects representing the HTML structure.
     *
     * Details:
     * - Uses `DOMParser` to convert the HTML string into a document.
     * - Defines a recursive `processNode` function to handle each node in the document tree:
     *   - Sets the `tag` property as `#text` for text nodes and as the lowercase tag name for element nodes.
     *   - Captures `textContent` for text nodes if non-empty.
     *   - For element nodes, captures all attributes in `dataParams`:
     *      - Converts attributes with dashed names (e.g., `data-props`) into camelCase (e.g., `dataProps`).
     *      - Parses JSON strings to objects if possible; otherwise, retains them as strings.
     * - Recursively processes child nodes, adding each as a child in the `children` array of its parent.
     * - Processes nodes only within the `<body>` to exclude `<html>` and `<body>` wrappers.
     *
     * This function is useful for converting HTML into a structured format for further use in rendering,
     * manipulation, or analysis in a component-based or DOM-agnostic system.
     */
    function DOMParseHtml(htmlString: string): IHtmlParserElementItem[] {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const elementsArray: IHtmlParserElementItem[] = [];

      // Helper function to process each node recursively
      function processNode(node: Node): IHtmlParserElementItem {
        const element: IHtmlParserElementItem = {
          tag: node.nodeType === Node.TEXT_NODE ? "#text" : (node as HTMLElement).tagName.toLowerCase(),
          children: [],
          dataParams: {}
        };

        // For text nodes, add textContent directly to the element object
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          element.textContent = node.textContent.trim();
        }

        // For element nodes, capture all attributes in dataParams
        if (node.nodeType === Node.ELEMENT_NODE) {
          const elementNode = node as HTMLElement;
          for (const attr of elementNode.attributes) {
            let value: string | object = attr.value;

            // Check if value is JSON and parse if possible
            try {
              const parsed = JSON.parse(attr.value);
              if (typeof parsed === "object" && parsed !== null) {
                value = parsed;
              }
            } catch (e) {
              // If parsing fails, retain it as a string
            }

            // Convert dashed attribute names to camelCase
            const camelCaseName = attr.name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            element.dataParams[camelCaseName] = value;
          }
        }

        // Recursively process all child nodes, adding them to the children array
        node.childNodes.forEach((childNode) => {
          element.children.push(processNode(childNode));
        });

        return element;
      }

      // Start processing from the body of the document to avoid <html> and <body> wrappers
      doc.body.childNodes.forEach((child) => {
        elementsArray.push(processNode(child));
      });

      return elementsArray;
    }

    /**
     * Renders an array of parsed HTML elements (IElementItem) into virtual DOM nodes.
     * This function processes each element, checking for custom component types and rendering
     * them accordingly, or rendering native HTML elements and text nodes as virtual DOM nodes.
     *
     * @param {IElementItem[]} elements - The array of parsed HTML elements, each with properties:
     *    - `tag`: the HTML tag name or `#text` for text nodes.
     *    - `children`: nested child elements, also of type IElementItem.
     *    - `textContent`: optional text content for text nodes.
     *    - `dataParams`: an object containing element attributes and optionally parsed JSON values.
     * @returns {any[]} - An array of virtual DOM nodes, each representing an HTML element, text node, or custom component.
     *
     * Details:
     * - If the element is a custom component (e.g., `basebutton`), it is rendered with custom props
     *   and event handlers based on `dataParams`.
     * - If the element is a text node (tag `#text`), it renders using `createTextVNode`.
     * - Otherwise, it renders native HTML elements with any attributes from `dataParams`.
     */
    function renderDOMParsedElements(elements: IHtmlParserElementItem[]): any[] {
      return elements.map((element) => {
        const { tag, children, textContent, dataParams } = element;

        // Render custom component
        if (customComponentsTest[tag]) {
          switch (tag) {
            case "basebutton":
              const dataProps = dataParams?.dataProps as IHtmlParserDataProps;
              // @src/assets/icons/up-right-arrow-icon.svg
              const accessoryIcon = "<svg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M18.9286 2.64296C18.9286 2.05123 18.4489 1.57153 17.8572 1.57153L2.14288 1.57153C1.55114 1.57153 1.07145 2.05123 1.07145 2.64296C1.07145 3.23469 1.55114 3.71439 2.14288 3.71439L15.2705 3.71439L1.38526 17.5996C0.966841 18.0181 0.966841 18.6964 1.38526 19.1149C1.80368 19.5333 2.48207 19.5333 2.90049 19.1149L16.7857 5.22962L16.7857 18.3572C16.7857 18.949 17.2654 19.4287 17.8572 19.4287C18.4489 19.4287 18.9286 18.949 18.9286 18.3572L18.9286 2.64296Z' fill='currentColor'/></svg>";
              return h('div', { class: dataProps?.wrapperClass}, [ h(BaseButton, {...dataProps, useAccessoryIconAsRaw: true, accessoryIcon, onTriggered: () => {
                // Fire the 'triggered' emit with a data object
                emit('triggered', { dataProps  });
              }}) ]);
            default:
              return null;
          }
        }

        // Render html text node element
        if (tag === "#text") {
          return createTextVNode(textContent); // Render text content inside the tag
        }

        // Render html element
        return h(tag, { ...dataParams }, renderDOMParsedElements(children));
      });
    }

    // On prop change, parse the HTML string
    watch(props, () => {
      parsedElementsTest.value = DOMParseHtml(props?.htmlString!);
    })

    // On component mount, parse the HTML string
    onMounted(async () => {
      // TODO: Make this dynamic, so any custom component can be used
      // const tag = "BaseButton";
      // customComponentDict[tag] = defineAsyncComponent(() =>
      //   import(`@/ui/controls/BaseButton.vue`)
      // );
      
      parsedElementsTest.value = DOMParseHtml(props?.htmlString!);
    });

    // Return the render function
    return () => {
      if (parsedElementsTest.value.length === 0) {
        return h('div', 'Loading...');
      }

      return h('div', { class: "html-parser" }, renderDOMParsedElements(parsedElementsTest.value));
    };
  }
});
</script>

<style scoped></style>
