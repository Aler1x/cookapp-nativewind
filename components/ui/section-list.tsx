import { SectionList as RNSectionList, SectionListRenderItem } from "react-native";
import type { ReactElement } from "react";

interface SectionListProps<T> {
  sections: { title: string; data: T[] }[];
  renderItem: SectionListRenderItem<T, { title: string; data: T[] }>;
  renderSectionHeader: (section: { title: string; data: T[] }) => ReactElement | null;
}

export default function SectionList<T>({ sections, renderItem, renderSectionHeader, ...props }: SectionListProps<T>) {
  return <RNSectionList
    sections={sections}
    renderItem={renderItem}
    renderSectionHeader={(info) => renderSectionHeader(info.section)}
    {...props}
  />;
} 