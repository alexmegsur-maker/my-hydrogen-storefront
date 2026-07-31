import {
  type ComponentLoaderArgs,
  createSchema,
} from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

export type CommunityGridPostNode = {
  id: string;
  handle: string;
  fields: {
    key: string;
    value: string | null;
    reference: {
      image?: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    } | null;
  }[];
};

type CommunityGridMetaobjectLoaderData = {
  posts: CommunityGridPostNode[];
};

type CommunityGridMetaobjectData = {
  postsLimit: number;
};

interface CommunityGridMetaobjectProps
  extends SectionProps<CommunityGridMetaobjectLoaderData>,
    CommunityGridMetaobjectData {
  ref?: React.Ref<HTMLElement>;
}

export default function CommunityGridMetaobject(
  props: CommunityGridMetaobjectProps,
) {
  const { children, ref, ...rest } = props;
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
}

export const loader = async (
  args: ComponentLoaderArgs<CommunityGridMetaobjectData>,
): Promise<CommunityGridMetaobjectLoaderData> => {
  const { weaverse, data } = args;
  const { storefront } = weaverse;
  const postsLimit = Math.max(1, Math.min(data?.postsLimit ?? 4, 4));

  const result = await storefront.query<{
    metaobjects: { nodes: CommunityGridPostNode[] };
  }>(COMMUNITY_GRID_METAOBJECT_QUERY, {
    variables: { first: 250 },
  });

  const allPosts = result?.metaobjects?.nodes ?? [];

  // Fisher-Yates shuffle: runs on every SSR render so a different random
  // subset (and order) of "comunidad_post" metaobjects is shown each time.
  const shuffled = [...allPosts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return { posts: shuffled.slice(0, postsLimit) };
};

const COMMUNITY_GRID_METAOBJECT_QUERY = `#graphql
  query CommunityGridMetaobjectPosts($first: Int) {
    metaobjects(type: "comunidad_post", first: $first) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const schema = createSchema({
  type: "community-grid-metaobject",
  title: "Comunity grid (metaobjeto)",
  childTypes: ["subheading", "heading", "community-grid-metaobject--items"],
  settings: [
    {
      group: "Data source",
      inputs: [
        {
          type: "range",
          label: "Cantidad de posts a mostrar",
          name: "postsLimit",
          defaultValue: 4,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
          helpText:
            'Muestra posts al azar del metaobjeto "comunidad_post" (máx. 4). Si hay menos posts creados que este valor, se muestran todos los disponibles. La selección cambia en cada renderizado de la página.',
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    children: [
      { type: "heading", content: "La comunidad Phoenix" },
      { type: "community-grid-metaobject--items" },
    ],
  },
});
