import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import axios from "axios";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { MentionItem } from "./MentionItem";
import type { Person } from '@/utils/types';
import { useIsMounted } from "@/utils/useMounted";

interface MentionListProps extends SuggestionProps {}

interface MentionListActions {
  onKeyDown: (props: SuggestionKeyDownProps) => void;
}

export const MentionList = forwardRef<MentionListActions, MentionListProps>(
  ({ clientRect, command, query }, ref) => {
    const referenceEl = useMemo(
      () => (clientRect ? { getBoundingClientRect: clientRect } : null),
      [clientRect]
    );

    const isMounted = useIsMounted();
    const [people, setPeople] = useState<Person[]>([]);
    useEffect(() => {
      axios({
        url: "https://swapi.dev/api/people",
        method: "get",
        params: { search: query }
      }).then((res: any) => {
        if (!isMounted.current) return;
        setPeople(res.data.results ?? []);
      });
    }, [query, isMounted]);

    const handleCommand = (index: number) => {
      const selectedPerson = people[index];
      command({ id: selectedPerson.url, label: selectedPerson.name });
    };

    const [hoverIndex, setHoverIndex] = useState(0);
    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        const { key } = event;

        if (key === "ArrowUp") {
          setHoverIndex((prev) => {
            const beforeIndex = prev - 1;
            return beforeIndex >= 0 ? beforeIndex : 0;
          });
          return true;
        }

        if (key === "ArrowDown") {
          setHoverIndex((prev) => {
            const afterIndex = prev + 1;
            const peopleCount = people.length - 1 ?? 0;
            return afterIndex < peopleCount ? afterIndex : peopleCount;
          });
          return true;
        }

        if (key === "Enter") {
          handleCommand(hoverIndex);
          return true;
        }

        return false;
      }
    }));

    const [el, setEl] = useState<HTMLDivElement | null>(null);
    const { styles, attributes } = usePopper(referenceEl as any, el, {
      placement: "bottom-start"
    });

    return createPortal(
      <div
        ref={setEl}
        className="mentionsContainer"
        style={styles.popper}
        {...attributes.popper}
      >
        {people.map((person, index) => (
          <MentionItem
            key={person.url}
            isActive={index === hoverIndex}
            onMouseEnter={() => setHoverIndex(index)}
            onClick={() => handleCommand(index)}
          >
            {person.name}
          </MentionItem>
        ))}
      </div>,
      document.body
    );
  }
);
