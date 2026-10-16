import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";

interface GtaSectionProps extends HydrogenComponentProps {}

export default function GtaSection(props: GtaSectionProps) {
  const { children } = props;
  return <>{children}</>;
}

export const schema = createSchema({
  title: "Gta section",
  type: "gta-section",
  enabledOn: {
    groups: ['*'],
  },
  childTypes: ["scroll-chair"],
});