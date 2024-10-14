import { Package } from "./App";
interface Props {
  pack: Package;
}

export const PackageComponent = ({ pack }: Props) => {
  return (
    <>
      <div>{`${pack?.name}: ${pack?.version}`}</div>
      <div style={{ marginLeft: 10 }}>
        {pack.dependencies?.map((p) => (
          <PackageComponent key={p.name} pack={p}></PackageComponent>
        ))}
      </div>
    </>
  );
};
