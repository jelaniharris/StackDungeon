'use client';

import { useDispatch } from 'react-redux';

import clsxm from '@/lib/clsxm';

import DomainImage from '@/components/DomainImage';
import Panel from '@/components/layout/Panel';

import { useAppSelector } from '@/store';
import { characterAction } from '@/store/Features/character/CharacterSlice';

export type DomainDataType = {
  name: string;
  slug: string;
  logo: string;
};

export const MAX_CHARACTER_DOMAINS = 2;

export const DOMAIN_DATA = [
  { name: 'React JS', slug: 'reactjs', logo: '/icons/tech/reactjs.png' },
  {
    name: 'Ruby On Rails',
    slug: 'ruby-on-rails',
    logo: '/icons/tech/rails.png',
  },
  { name: 'Node JS', slug: 'nodejs', logo: '/icons/tech/nodejs.png' },
  { name: 'Javascript', slug: 'javascript', logo: '/icons/tech/js.png' },
];

const SelectStacks = () => {
  const character = useAppSelector((state) => state.character);

  const ShowDomain = ({ domain }: { domain: DomainDataType }) => {
    const dispatch = useDispatch();
    const toggleDomain = (domain: string) => {
      if (!character) return;

      if (character.domains.includes(domain)) {
        // Domain exists, then remove it
        console.log('Removing ', domain);
        dispatch(characterAction.removeDomain(domain));
      } else {
        if (character.domains.length < MAX_CHARACTER_DOMAINS) {
          // Domain is not there, then add it
          dispatch(characterAction.addDomain(domain));
        }
      }
    };

    let selectedDomain = false;
    if (character && character.domains.includes(domain.slug)) {
      selectedDomain = true;
    }

    return (
      <button
        className={clsxm(
          'mx-2 flex flex-col items-center gap-3 rounded-md bg-accent-100 p-5',
          [selectedDomain === true && 'bg-accent-300']
        )}
        data-slug={domain.slug}
        onClick={() => toggleDomain(domain.slug)}
      >
        <DomainImage domainData={domain} width={128} height={128} />
        <h4 className='hidden md:block'>{domain.name}</h4>
      </button>
    );
  };

  return (
    <div>
      <Panel title='Select Domains'>
        <div className='mb-6 text-center'>
          <h3 className='mb-3'>
            Select up to {MAX_CHARACTER_DOMAINS} domains to study.
          </h3>
          <div className='flex flex-row items-center gap-2'>
            {DOMAIN_DATA.map((domain) => (
              <div key={`domain-${domain.slug}`}>
                <ShowDomain domain={domain} />
              </div>
            ))}
          </div>
          {character.domains.length == MAX_CHARACTER_DOMAINS && (
            <div className='mt-4'>
              <h3>Max Domains Reached</h3>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default SelectStacks;
