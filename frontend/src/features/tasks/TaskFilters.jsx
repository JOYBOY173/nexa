import Tabs from "../../components/ui/Tabs.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

export default function TaskFilters({ active, onChange }) {
  return <Tabs items={FILTERS} active={active} onChange={onChange} ariaLabel="Task filters" />;
}
