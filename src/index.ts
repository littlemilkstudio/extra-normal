interface FooProps {
  v: number;
}

export const foo = ({ v }: FooProps): any => {
  return `foo-${v}`;
};
